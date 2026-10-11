export const LEVEL_HEIGHT = 16

const GROUND_STYLES = {
  grass: (depth) => (depth === 0 ? "G" : depth < 4 ? "D" : "S"),
  stone: () => "S",
  nether: () => "N"
}

// Coordinates are block columns/rows with row 0 at the top. Mobs, beds and signs are placed
// by the row whose top surface they stand on; pickups float inside the given cell.
const createBuilder = (width, style) => {
  const height = LEVEL_HEIGHT
  const grid = Array.from({ length: height }, () => Array(width).fill("."))
  const entities = []

  const inBounds = (x, y) => x >= 0 && x < width && y >= 0 && y < height
  const set = (x, y, tile) => {
    if (inBounds(x, y)) grid[y][x] = tile
  }
  const fill = (x0, y0, x1, y1, tile) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, tile)
  }
  const add = (type, x, y, extra = {}) => entities.push({ type, x, y, ...extra })

  return {
    grid,
    entities,
    set,
    fill,
    ground: (x0, x1, top) => {
      const tileFor = GROUND_STYLES[style]
      for (let x = x0; x <= x1; x++) {
        for (let y = 0; y < height; y++) {
          if (y < top) {
            if (grid[y][x] !== "." && y > 2) set(x, y, ".")
            continue
          }
          set(x, y, y === height - 1 ? "B" : tileFor(y - top))
        }
      }
    },
    pit: (x0, x1, fromRow = 3) => fill(x0, fromRow, x1, height - 1, "."),
    lava: (x0, x1, top = 13, fromRow = 3) => {
      fill(x0, fromRow, x1, height - 1, ".")
      fill(x0, top, x1, height - 1, "X")
    },
    pillar: (x0, x1, top, tile) => fill(x0, top, x1, height - 1, tile),
    tree: (x, groundTop, trunk = 4) => {
      const topLog = groundTop - trunk
      for (let dy = -2; dy <= 1; dy++) {
        const reach = dy < 0 ? 1 : 2
        for (let dx = -reach; dx <= reach; dx++) {
          if (grid[topLog + dy]?.[x + dx] === ".") set(x + dx, topLog + dy, "L")
        }
      }
      fill(x, topLog, x, groundTop - 1, "W")
    },
    portal: (x, groundTop) => {
      fill(x, groundTop - 5, x + 3, groundTop - 1, "q")
      fill(x, groundTop, x + 3, groundTop, "Q")
      fill(x + 1, groundTop - 4, x + 2, groundTop - 1, ".")
      add("portal", x + 1, groundTop - 4, { w: 2, h: 4 })
    },
    player: (x, y) => add("player", x, y),
    creeper: (x, y) => add("creeper", x, y),
    skeleton: (x, y) => add("skeleton", x, y),
    diamond: (x, y) => add("diamond", x, y),
    apple: (x, y) => add("apple", x, y),
    bed: (x, y) => add("bed", x, y),
    sign: (x, y, text) => add("sign", x, y, { text }),
    torch: (x, y) => set(x, y, "t")
  }
}

const defineLevel = ({ id, name, theme, style, width, build }) => {
  const b = createBuilder(width, style)
  build(b)
  return {
    id,
    name,
    theme,
    width,
    height: LEVEL_HEIGHT,
    grid: b.grid.map((row) => row.join("")),
    entities: b.entities
  }
}

const plains = defineLevel({
  id: "plains",
  name: "Grassy Plains",
  theme: "day",
  style: "grass",
  width: 112,
  build: (b) => {
    b.ground(0, 13, 12)
    b.ground(10, 11, 11)
    b.player(2, 12)
    b.sign(4, 12, "Hi Christopher! Walk with the arrow keys or A and D.")
    b.sign(7, 12, "Jump with SPACE, W or the up arrow. Hold it to jump higher!")
    b.diamond(10, 9)
    b.sign(13, 12, "Watch out for holes! Jump over them.")
    b.pit(15, 16)

    b.ground(17, 33, 12)
    b.sign(18, 12, "That's a CREEPER! Press X to swing your sword, or jump on his head!")
    b.tree(21, 12)
    b.diamond(24, 10)
    b.creeper(29, 12)

    b.ground(34, 44, 10)
    b.sign(32, 12, "SKELETONS shoot arrows. Swing your sword to smack arrows right back!")
    b.diamond(37, 8)
    b.diamond(38, 8)
    b.skeleton(41, 10)
    b.pit(45, 47)

    b.ground(48, 57, 11)
    b.bed(49, 11)
    b.sign(51, 11, "Touch a BED to save your spot. If you get hurt, you come back here!")
    b.ground(55, 55, 10)
    b.ground(56, 56, 9)
    b.ground(57, 57, 8)
    b.pit(58, 66)
    b.fill(58, 8, 66, 8, "P")
    b.diamond(60, 6)
    b.diamond(62, 6)
    b.diamond(64, 6)

    b.ground(67, 80, 10)
    b.apple(69, 8)
    b.creeper(71, 10)
    b.tree(74, 10)
    b.creeper(78, 10)
    b.pit(81, 83)

    b.ground(84, 111, 10)
    b.sign(86, 10, "The purple PORTAL takes you to the next world!")
    b.diamond(88, 8)
    b.skeleton(92, 10)
    b.tree(95, 10)
    b.diamond(99, 8)
    b.portal(102, 10)
  }
})

const woods = defineLevel({
  id: "woods",
  name: "Creeper Woods",
  theme: "dusk",
  style: "grass",
  width: 130,
  build: (b) => {
    b.ground(0, 20, 12)
    b.player(2, 12)
    b.sign(4, 12, "Welcome to Creeper Woods, Christopher! It's getting dark...")
    b.tree(7, 12)
    b.tree(12, 12, 5)
    b.diamond(15, 10)
    b.creeper(18, 12)
    b.pit(21, 23)

    b.ground(24, 39, 11)
    b.tree(26, 11)
    b.set(28, 10, "H")
    b.fill(29, 8, 31, 8, "H")
    b.diamond(30, 6)
    b.diamond(31, 6)
    b.creeper(31, 11)
    b.creeper(37, 11)
    b.pit(40, 42)

    b.ground(43, 55, 12)
    b.bed(44, 12)
    b.tree(44, 12)
    b.skeleton(48, 12)
    b.tree(52, 12, 5)
    b.creeper(54, 12)

    b.ground(56, 58, 10)
    b.pit(59, 71)
    b.fill(60, 10, 61, 10, "H")
    b.fill(64, 9, 65, 9, "H")
    b.fill(68, 10, 69, 10, "H")
    b.diamond(64, 7)
    b.diamond(65, 7)

    b.ground(72, 90, 11)
    b.tree(74, 11)
    b.creeper(77, 11)
    b.apple(79, 9)
    b.creeper(81, 11)
    b.diamond(83, 9)
    b.tree(84, 11, 5)
    b.creeper(86, 11)
    b.ground(88, 90, 9)
    b.skeleton(89, 9)
    b.pit(91, 93)

    b.ground(94, 129, 11)
    b.bed(95, 11)
    b.sign(97, 11, "Creepers hiss and flash before they go BOOM. Run away or bonk them first!")
    b.skeleton(101, 11)
    b.diamond(103, 9)
    b.tree(104, 11)
    b.creeper(107, 11)
    b.creeper(114, 11)
    b.diamond(117, 9)
    b.tree(118, 11, 5)
    b.portal(121, 11)
  }
})

const caves = defineLevel({
  id: "caves",
  name: "Skeleton Caves",
  theme: "cave",
  style: "stone",
  width: 130,
  build: (b) => {
    b.ground(0, 129, 12)
    b.fill(0, 0, 129, 0, "B")
    b.fill(0, 1, 129, 2, "S")

    b.player(2, 12)
    b.sign(4, 12, "It's dark down here! Smash the sparkly DIAMOND ORE with your sword.")
    b.torch(6, 9)
    b.set(9, 11, "O")
    b.set(12, 11, "O")
    b.torch(14, 9)
    b.lava(16, 18)

    b.set(22, 11, "O")
    b.torch(24, 9)
    b.skeleton(26, 12)
    b.fill(29, 10, 29, 11, "C")
    b.sign(28, 12, "Hide behind blocks so arrows can't reach you!")
    b.torch(31, 9)
    b.skeleton(33, 12)
    b.lava(35, 37)

    b.ground(38, 50, 11)
    b.fill(40, 3, 48, 4, "S")
    b.bed(39, 11)
    b.torch(42, 8)
    b.creeper(45, 11)
    b.diamond(47, 9)
    b.lava(51, 69)
    b.pillar(53, 54, 10, "C")
    b.pillar(57, 58, 9, "C")
    b.pillar(61, 62, 10, "C")
    b.pillar(65, 66, 9, "C")
    b.diamond(57, 7)
    b.diamond(65, 7)
    b.torch(59, 6)

    b.ground(70, 90, 11)
    b.bed(72, 11)
    b.torch(73, 8)
    b.skeleton(77, 11)
    b.set(80, 10, "O")
    b.creeper(83, 11)
    b.torch(86, 8)
    b.lava(91, 93)

    b.diamond(97, 10)
    b.skeleton(100, 12)
    b.torch(102, 9)
    b.creeper(105, 12)
    b.skeleton(109, 12)
    b.diamond(111, 10)
    b.set(113, 11, "O")
    b.torch(119, 9)
    b.portal(122, 12)
  }
})

const nether = defineLevel({
  id: "nether",
  name: "Nether Dash",
  theme: "nether",
  style: "nether",
  width: 140,
  build: (b) => {
    b.ground(0, 139, 11)
    b.fill(0, 0, 139, 1, "N")
    for (const x of [8, 9, 27, 46, 47, 63, 88, 101, 102, 117, 130]) b.set(x, 2, "Y")

    b.player(2, 11)
    b.sign(4, 11, "The NETHER! Don't touch the lava. You've got this, Christopher!")
    b.lava(15, 17)

    b.diamond(21, 9)
    b.creeper(24, 11)
    b.skeleton(29, 11)
    b.lava(31, 50)
    b.fill(33, 10, 35, 10, "N")
    b.fill(38, 9, 39, 9, "N")
    b.fill(42, 10, 44, 10, "N")
    b.fill(47, 9, 48, 9, "N")
    b.diamond(38, 7)
    b.diamond(47, 7)

    b.ground(51, 66, 10)
    b.bed(52, 10)
    b.apple(55, 8)
    b.skeleton(58, 10)
    b.set(60, 9, "Y")
    b.creeper(63, 10)
    b.lava(67, 69)

    b.creeper(74, 11)
    b.diamond(77, 9)
    b.creeper(80, 11)
    b.ground(83, 86, 9)
    b.skeleton(85, 9)
    b.lava(87, 104)
    b.fill(89, 10, 90, 10, "N")
    b.fill(93, 9, 94, 9, "N")
    b.fill(97, 9, 98, 9, "N")
    b.fill(101, 10, 102, 10, "N")
    b.diamond(93, 7)
    b.diamond(97, 7)

    b.ground(105, 139, 10)
    b.bed(106, 10)
    b.diamond(109, 8)
    b.skeleton(112, 10)
    b.creeper(115, 10)
    b.skeleton(119, 10)
    b.sign(123, 10, "Almost home! Jump in the portal, champ!")
    b.ground(126, 139, 9)
    b.creeper(128, 9)
    b.portal(132, 9)
  }
})

export const LEVELS = [plains, woods, caves, nether]
