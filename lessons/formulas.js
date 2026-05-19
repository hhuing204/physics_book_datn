const formulas = [
  {
    id: "1.1",
    latex: "f = \\frac{1}{T}"
  },
  {
    id: "1.2",
    latex: "\\Delta \\varphi = 2\\pi \\frac{\\Delta t}{T}"
  },
  {
    id: "1.3",
    latex: "\\omega = \\frac{2\\pi}{T} = 2\\pi f"
  },
  {
    id: "2.1",
    latex: "x = A \\cos(\\omega t + \\varphi_0)"
  },
  {
    id: "2.2",
    latex: "d = \\Delta x = x - x_0 = A \\cos(\\omega t + \\varphi_0) - A \\cos(\\varphi_0)"
  },
  {
    id: "2.3",
    latex: "v = \\frac{d}{\\Delta t}"
  }
  ,
  {
    id: "2.4",
    latex: "v = A \\omega \\cos(\\omega t + \\varphi_0 + \\frac{\\pi}{2}) = -A \\omega \\sin(\\omega t + \\varphi_0)"
  },
  {
    id: "2.5",
    latex: "\\frac{v^2}{\\omega^2} + \\frac{x^2}{A^2} = 1"
  },
  {
    id: "2.6",
    latex: "a = \\frac{\\Delta v}{\\Delta t}"
  },
  {
    id: "2.7",
    latex: "a = \\omega^2 A \\cos(\\omega t + \\varphi_0 + \\pi) = -\\omega^2 A \\cos(\\omega t + \\varphi_0) = -\\omega^2 x"
  },
  {
    id: "2.8",
    latex: "\\vec{P} + \\vec{N} + \\vec{F} = m\\vec{a}"
  },
  {
    id: "2.9",
    latex: "F = ma"
  },
  {
    id: "2.10",
    latex: "a = -\\frac{k}{m} x"
  },
  {
    id: "2.11",
    latex: "\\omega^2 = \\frac{k}{m}"
  },
  {
    id: "2.12",
    latex: "F = -mg \\sin \\theta = ma"
  },
  {
    id: "2.13",
    latex: "\\sin \\theta \\approx \\tan \\theta \\approx \\theta = \\frac{x}{l}"
  },
  {
    id: "2.14",
    latex: "a = -\\frac{g}{l} x"
  },
  {
    id: "2.15",
    latex: "\\omega^2 = \\frac{g}{l}"
  },
  {
    id: "3.1",
    latex: "W_t = \\frac{1}{2}Kx^2"
  },
  {
    id: "3.2",
    latex: "W_t = \\frac{1}{2}Kx^2 = \\frac{1}{2}m\\omega^2 A^2 \\cos^2(\\omega t + \\varphi_0)"
  },
  {
    id: "3.3",
    latex: "W_t = \\frac{1}{4}m\\omega^2 A^2 + \\frac{1}{4}m\\omega^2 A^2 \\cos2(\\omega t + \\varphi_0)"
  },
  {
    id: "3.4",
    latex: "\\omega’ = 2\\omega"
  },
  {
    id: "3.5",
    latex: "W_đ = \\frac{1}{2}mv^2 = \\frac{1}{2}m\\omega^2 A^2 \\sin^2(\\omega t + \\varphi_0)"
  },
  {
    id: "3.6",
    latex: "W_đ = \\frac{1}{4}m\\omega^2 A^2 - \\frac{1}{4}m\\omega^2 A^2 \\cos2(\\omega t + \\varphi_0)"
  },
  {
    id: "3.7",
    latex: "W = W_t + W_đ = \\frac{1}{2}m \\omega^2 A^2"
  },
  {
    id: "4.1",
    latex: "F = F_0 \\cos(\\Omega t + \\varphi_0)"
  },

]

export default formulas;