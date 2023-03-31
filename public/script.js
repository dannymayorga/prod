document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.querySelector("#submit");
    const outputPane = document.querySelector("#ai-generated-content");
    const deleteBtn = document.querySelector("#delete");
    const downloadBtn = document.querySelector("#download");
    const templateBtns = document.querySelectorAll(".template-btn");
    const errorContainer = document.querySelector("#error-container");
    let selectedTemplate = null;

    templateBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            templateBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedTemplate = btn.dataset.template;
            // Show/hide specific fields based on the selected template
            document.querySelectorAll(".form-fields").forEach(el => el.style.display = "none");
            document.querySelector(`#${selectedTemplate}-fields`).style.display = "block";
            // Clear any previous error message
            errorContainer.textContent = "";
        });
    });

    submitBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        if (!selectedTemplate) {
            handleError("Please select a template (Epic, Feature, User Story, Editor).");
            return;
        }

        // Collect field values based on the selected template
        const fieldValues = {};
        const fields = document.querySelectorAll(`#${selectedTemplate}-fields .field`);
        fields.forEach(field => {
            fieldValues[field.name] = field.value;
        });

        try {
            const response = await fetch(`https://prod-ai-1.herokuapp.com/generate-content?template=${selectedTemplate}&fields=${encodeURIComponent(JSON.stringify(fieldValues))}`);

            const data = await response.json();
            if (data.error) {
                handleError(`Error: ${data.error.message}`);
            } else if (data.choices && data.choices.length > 0) {
                const aiGeneratedContent = data.choices[0].text;
                outputPane.innerHTML = aiGeneratedContent;
                errorContainer.textContent = ""; // Clear any previous error message
            } else {
                handleError("Error: Unable to generate content.");
            }
        } catch (error) {
            handleError("Error fetching ChatGPT:", error);
        }
    });

    deleteBtn.addEventListener("click", function () {
        outputPane.innerHTML = "";
    });

    downloadBtn.addEventListener("click", function () {
        const content = outputPane.innerHTML;
        if (content) {
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "ai-generated-content.txt";
            link.click();
            URL.revokeObjectURL(url);
        }
    });
});

function handleError(message, error) {
    console.error(message, error);
    // Display an error message to the user.
    const errorContainer = document.querySelector("#error-container");
    errorContainer.textContent = message;
    // Log additional details for debugging purposes.
    console.error("Error details:", error);
    // You can add additional error handling logic here, such as sending the error details to the server for logging.
}
