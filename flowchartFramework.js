class FlowchartFramework {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error("Container not found!");
    }

    render(json) {
        if (!json || typeof json !== "object") throw new Error("Invalid JSON input.");

        this.container.innerHTML = ''; // Clear previous drawings

        json.steps.forEach(step => this.drawStep(step, json));
    }

    drawStep(step, json) {
        const x = step.position.x;
        const y = step.position.y;

        // Draw main process box
        this.drawRect(x, y, 150, 80, "lightblue", `${step.equipment.name} (${step.equipment.code})\n${step.stepDescription}`);

        // Draw Input Material (Left Arrow)
        step.inputMaterials.forEach((material, index) => {
            this.drawArrow(x - 100, y + (index * 30), x, y, "black");
            this.drawText(x - 120, y + (index * 30), material.name);
        });

        // Draw Output Materials (Bottom Arrow)
        if (step.outputMaterials.length > 0) {
            step.outputMaterials.forEach((output, index) => {
                const targetY = y + 100 + (index * 30);
                this.drawArrow(x + 75, y + 80, x + 75, targetY, "black");
                this.drawText(x + 75, targetY, output.name);
                if (output.linkToNextStep) this.drawStep(json.steps.find(s => s.id === output.linkToNextStep), json);
            });
        }

        // Draw Waste Materials (Right Arrow)
        step.outputWastes.forEach((waste, index) => {
            this.drawArrow(x + 160, y + (index * 30), x + 200, y + (index * 30), "red");
            this.drawText(x + 210, y + (index * 30), waste.name);
        });

        // Draw Previous Step (Up Arrow)
        if (step.linkToPreviousStep) {
            this.drawArrow(x + 75, y - 50, x + 75, y, "blue");
            this.drawText(x + 75, y - 60, "Prev Step");
        }

        // Draw Analysis Failure (Right Arrow)
        if (step.analysis.some(a => a.result === 0)) {
            this.drawArrow(x + 160, y + 40, x + 250, y + 40, "orange");
            this.drawText(x + 260, y + 40, "Failure Path");
        }
    }

    drawRect(x, y, width, height, color, text) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", color);
        rect.setAttribute("stroke", "black");

        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", x + width / 2);
        textElement.setAttribute("y", y + height / 2);
        textElement.setAttribute("text-anchor", "middle");
        textElement.textContent = text;

        this.container.appendChild(rect);
        this.container.appendChild(textElement);
    }

    drawArrow(x1, y1, x2, y2, color) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "2");

        this.container.appendChild(line);
    }

    drawText(x, y, text) {
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", x);
        textElement.setAttribute("y", y);
        textElement.textContent = text;
        this.container.appendChild(textElement);
    }
}