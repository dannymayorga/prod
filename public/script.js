document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.querySelector("#submit");
    const outputPane = document.querySelector("#ai-generated-content");
    const deleteBtn = document.querySelector("#delete");
    const downloadBtn = document.querySelector("#download");
    const pills = document.querySelectorAll(".pill");
    let selectedType = null;

    pills.forEach(pill => {
        pill.addEventListener("click", function () {
            pills.forEach(p => p.classList.remove("selected"));
            pill.classList.add("selected");
            selectedType = pill.dataset.type;
        });
    });

    submitBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        if (!selectedType) {
            alert("Please select a content type (Epic, Feature, User Stories).");
            return;
        }

        const longForm = document.querySelector("#long-form").value;
        const shortForm = document.querySelector("#short-form").value;

        try {
            const response = await fetch(`https://prod-ai-1.herokuapp.com/generate-content?type=${selectedType}&longForm=${encodeURIComponent(longForm)}&shortForm=${encodeURIComponent(shortForm)}`);

            const data = await response.json();
            if (data.error) {
                handleError(`Error: ${data.error.message}`);
            } else if (data.choices && data.choices.length > 0) {
                const aiGeneratedContent = data.choices[0].text;
                outputPane.innerHTML = aiGeneratedContent;
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
    // You can add additional error handling logic here, such as displaying an error message to the user.
}
