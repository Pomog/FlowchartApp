document.addEventListener("DOMContentLoaded", function() {
    const flowchart = new FlowchartFramework("flowchart-container");

    document.getElementById("generate-btn").addEventListener("click", function() {
        try {
            const jsonInput = JSON.parse(document.getElementById("json-input").value);
            flowchart.render(jsonInput);
        } catch (error) {
            alert("Invalid JSON format");
        }
    });
});