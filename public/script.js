document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.querySelector("#submit");
    const outputPane = document.querySelector("#ai-generated-content");
    const deleteBtn = document.querySelector("#delete");
    const downloadBtn = document.querySelector("#download");
    const pills = document.querySelectorAll(".pill");
    const errorContainer = document.querySelector("#error-container");
    const spinnerContainer = document.querySelector("#spinner-container");
    let selectedType = null;

    // Hide the spinner by default
    spinnerContainer.style.display = "none";

    pills.forEach(pill => {
        pill.addEventListener("click", function () {
            pills.forEach(p => p.classList.remove("selected"));
            pill.classList.add("selected");
            selectedType = pill.dataset.type;
            // Show/hide specific fields based on the selected content type
            document.querySelectorAll(".form-fields").forEach(el => el.style.display = "none");
            document.querySelector(`#${selectedType}-fields`).style.display = "block";
            // Clear any previous error message
            errorContainer.textContent = "";
        });
    });

    submitBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        // Show the spinner
        spinnerContainer.style.display = "block";
        if (!selectedType) {
            handleError("Please select a content type (Epic, Feature, User Stories).");
            return;
        }

        const role = document.querySelector("#role").value;
        const title = document.querySelector(`#${selectedType}-title`).value;
        const description = document.querySelector(`#${selectedType}-description`).value;

        try {
            const response = await fetch(`https://prod-ai-1.herokuapp.com/generate-content?type=${selectedType}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`);

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
            // Hide the spinner after the response is received
            spinnerContainer.style.display = "none";
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
