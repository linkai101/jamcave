
class Stroke {
  constructor(tool, path, color, lineWidth, lineCap) {
    this.tool = tool || "brush"; // brush, line, rect, circle
    this.path = path || [];
    this.color = color || "black";
    this.lineWidth = lineWidth || 3;
    this.lineCap = lineCap || "round";
  }
}

export default Stroke;