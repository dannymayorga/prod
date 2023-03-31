document.addEventListener("DOMContentLoaded", function () {
    const templateBtns = document.querySelectorAll(".template-btn");
    const dynamicContent = document.querySelector("#dynamic-content");
    const outputPane = document.querySelector("#ai-generated-content");
    const deleteBtn = document.querySelector("#delete");
    const downloadBtn = document.querySelector("#download");
    const errorContainer = document.querySelector("#error-container");
    let selectedTemplate = null;

    templateBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            templateBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedTemplate = btn.dataset.template;
            // Show/hide specific fields based on the selected template
            dynamicContent.innerHTML = generateFormFields(selectedTemplate);
            // Clear any previous error message
            errorContainer.textContent = "";
        });
    });

    dynamicContent.addEventListener("click", async function (event) {
        if (event.target.id === "submit") {
            event.preventDefault();
            // Show progress icon
            document.getElementById("progress-container").style.display = "block";
            // ... (rest of the code for content generation)
            // Hide progress icon after content generation is done
            document.getElementById("progress-container").style.display = "none";
        }
    });

    dynamicContent.addEventListener("click", async function (event) {
        if (event.target.id === "submit") {
            event.preventDefault();
            if (!selectedTemplate) {
                handleError("Please select a template (Epic, Feature, User Story, Editor).");
                return;
            }

            // Collect field values based on the selected template
            const fieldValues = {};
            const fields = document.querySelectorAll(`.field`);
            fields.forEach(field => {
                fieldValues[field.name] = field.value;
            });

            // Construct the prompt for the AI
            const prompt = constructPrompt(selectedTemplate, fieldValues);

            try {
                const response = await fetch(`https://prod-ai-1.herokuapp.com/generate-content`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt })
                });

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
// Construct the prompt for the AI based on the selected template and field values
function constructPrompt(template, fieldValues) {
    let prompt = "";
    switch (template) {
        case "epic":
            prompt = `Create an Epic:\nSupporting Theme: ${fieldValues.supportingTheme || '[AI recommend]'}\nEpic Name: ${fieldValues.epicName || '[AI recommend]'}\nDescription: ${fieldValues.description || '[AI recommend]'}\nAcceptance Criteria: ${fieldValues.acceptanceCriteria || '[AI recommend]'}\nMetrics: ${fieldValues.metrics || '[AI recommend]'}\nAdditional Notes: ${fieldValues.additionalNotes || '[AI recommend]'}\nOpen Questions: ${fieldValues.openQuestions || '[AI recommend]'}\n\nPlease provide the following:\n1. Detailed Epic description\n2. Acceptance Criteria\n3. Metrics\n4. Additional Notes\n5. Open Questions`;
            break;
        // Similar prompt construction logic for other templates (feature, user-story, editor)
        // ...
    }
    return prompt;
}
// Generate form fields based on the selected template
function generateFormFields(template) {
    let formFields = '';
    switch (template) {
        case 'epic':
            formFields = `
                <form class="form-container">
                    <div class="form-group">
                    <label for="supportingTheme">Supporting Theme:</label>
                    <input type="text" class="field" name="supportingTheme" id="supportingTheme" placeholder="AI can recommend">
                    </div>
                    <div class="form-group">
                    <label for="epicName">Epic Name:</label>
                    <input type="text" class="field" name="epicName" id="epicName" placeholder="AI can recommend">
                    </div>
                    <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea class="field" name="description" id="description" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="acceptanceCriteria">Acceptance Criteria:</label>
                    <textarea class="field" name="acceptanceCriteria" id="acceptanceCriteria" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="metrics">Metrics:</label>
                    <textarea class="field" name="metrics" id="metrics" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="additionalNotes">Additional Notes:</label>
                    <textarea class="field" name="additionalNotes" id="additionalNotes" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="openQuestions">Open Questions:</label>
                    <textarea class="field" name="openQuestions" id="openQuestions" placeholder="AI can recommend"></textarea>
                    </div>
                    <button id="submit">Generate Content</button>
                </form>              
            `;
            break;
        case 'feature':
            formFields = `
                <form class="form-container">
                    <div class="form-group">
                    <label for="featureName">Feature Name / Title:</label>
                    <input type="text" class="field" name="featureName" id="featureName" placeholder="AI can recommend">
                    </div>
                    <div class="form-group">
                    <label for="priority">Priority:</label>
                    <input type="text" class="field" name="priority" id="priority" placeholder="AI can recommend">
                    </div>
                    <div class="form-group">
                    <label for="businessReason">Business Reason:</label>
                    <textarea class="field" name="businessReason" id="businessReason" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="goalsAndObjectives">Goals and Objectives:</label>
                    <textarea class="field" name="goalsAndObjectives" id="goalsAndObjectives" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="metrics">Metrics:</label>
                    <textarea class="field" name="metrics" id="metrics" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="primaryUser">Primary User / Stakeholder:</label>
                    <input type="text" class="field" name="primaryUser" id="primaryUser" placeholder="AI can recommend">
                    </div>
                    <div class="form-group">
                    <label for="timeline">Timeline:</label>
                    <input type="text" class="field" name="timeline" id="timeline" placeholder="AI can recommend">
                    </div>
                    <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea class="field" name="description" id="description" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="useCases">Use Cases:</label>
                    <textarea class="field" name="useCases" id="useCases" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="security">Security:</label>
                    <textarea class="field" name="security" id="security" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="compliance">Compliance:</label>
                    <textarea class="field" name="compliance" id="compliance" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="performance">Performance / Reliability:</label>
                    <textarea class="field" name="performance" id="performance" placeholder="AI can recommend"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="dependencies">Dependencies:</label>
                    <textarea class="field" name="dependencies" id="dependencies" placeholder="AI can recommend"></textarea>
                    </div>
                    <button id="submit">Generate Content</button>
                </form>
            `;
            break;
        case 'user-story':
            formFields = `
                <form class="form-container">
                    <div class="form-group">
                    <label for="title">Title:</label>
                    <input type="text" class="field" name="title" id="title" placeholder="AI can recommend">
                    </div>
                    <div class="form-group">
                    <label for="priority">Priority:</label>
                    <input type="text" class="field" name="priority" id="priority" placeholder="AI can recommend">
                    </div>
                    <div class="form-group">
                    <label for="acceptanceCriteria">Acceptance Criteria:</label>
                    <textarea class="field" name="acceptanceCriteria" id="acceptanceCriteria" placeholder="AI can recommend"></textarea>
                    </div>
                    <button id="submit">Generate Content</button>
                </form>
            `;
            break;
        case 'editor':
        formFields = `
            <form class="form-container">
                <div class="form-group">
                <label for="description">Description:</label>
                <textarea class="field" name="description" id="description" placeholder="AI can recommend"></textarea>
                </div>
                <div class="form-group">
                <label for="keywords">Keywords:</label>
                <input type="text" class="field" name="keywords" id="keywords" placeholder="AI can recommend">
                </div>
                <div class="form-group">
                <label for="inputLanguage">Input Language:</label>
                <input type="text" class="field" name="inputLanguage" id="inputLanguage" placeholder="English">
                </div>
                <div class="form-group">
                <label for="outputLanguage">Output Language:</label>
                <input type="text" class="field" name="outputLanguage" id="outputLanguage" placeholder="English">
                </div>
                <div class="form-group">
                <label for="tone">Tone:</label>
                <input type="text" class="field" name="tone" id="tone" placeholder="AI can recommend">
                </div>
                <div class="form-group">
                <label for="formality">Formality:</label>
                <input type="text" class="field" name="formality" id="formality" placeholder="AI can recommend">
                </div>
                <button id="submit">Generate Content</button>
            </form>
        `;
        break; 
    }
    return formFields;
}
// Construct the prompt for the AI based on the selected template and field values
function constructPrompt(template, fieldValues) {
    let prompt = "";
    switch (template) {
        case "epic":
            prompt = `Create an Epic:
            Supporting Theme: ${fieldValues.supportingTheme || '[AI recommend]'}
            Epic Name: ${fieldValues.epicName || '[AI recommend]'}
            Description: ${fieldValues.description || '[AI recommend]'}
            Acceptance Criteria: ${fieldValues.acceptanceCriteria || '[AI recommend]'}
            Metrics: ${fieldValues.metrics || '[AI recommend]'}
            Additional Notes: ${fieldValues.additionalNotes || '[AI recommend]'}
            Open Questions: ${fieldValues.openQuestions || '[AI recommend]'}
            \n\nPlease provide the following:
            1. Detailed Epic description
            2. Acceptance Criteria
            3. Metrics
            4. Additional Notes
            5. Open Questions.`;
            break;
        case "feature":
            prompt = `Create a Feature:
            Feature Name / Title: ${fieldValues.featureName || '[AI recommend]'}
            Priority: ${fieldValues.priority || '[AI recommend]'}
            Business Reason: ${fieldValues.businessReason || '[AI recommend]'}
            Goals and Objectives: ${fieldValues.goalsAndObjectives || '[AI recommend]'}
            Metrics: ${fieldValues.metrics || '[AI recommend]'}
            Primary User / Stakeholder: ${fieldValues.primaryUser || '[AI recommend]'}
            Timeline: ${fieldValues.timeline || '[AI recommend]'}
            Description: ${fieldValues.description || '[AI recommend]'}
            Use Cases: ${fieldValues.useCases || '[AI recommend]'}
            Security: ${fieldValues.security || '[AI recommend]'}
            Compliance: ${fieldValues.compliance || '[AI recommend]'}
            Performance / Reliability: ${fieldValues.performance || '[AI recommend]'}
            Dependencies: ${fieldValues.dependencies || '[AI recommend]'}
            \n\nPlease provide the following:
            1. Detailed Feature description
            2. Goals and Objectives
            3. Use Cases
            4. Security, Compliance, Performance considerations
            5. Dependencies.`;
            break;
        case "user-story":
            prompt = `Create a User Story:
            Title: ${fieldValues.title || '[AI recommend]'}
            Priority: ${fieldValues.priority || '[AI recommend]'}
            Acceptance Criteria: ${fieldValues.acceptanceCriteria || '[AI recommend]'}
            \n\nPlease provide the following:
            1. User Story Title
            2. Acceptance Criteria.`;
            break;
        case "editor":
            prompt = `Edit Content:
            Description: ${fieldValues.description || '[AI recommend]'}
            Keywords: ${fieldValues.keywords || '[AI recommend]'}
            Input Language: ${fieldValues.inputLanguage || 'English'}
            Output Language: ${fieldValues.outputLanguage || 'English'}
            Tone: ${fieldValues.tone || '[AI recommend]'}
            Formality: ${fieldValues.formality || '[AI recommend]'}
            \n\nPlease provide the following:
            1. Edited content based on the given information and preferences.`;
            break;
        default:
            prompt = "Please select a valid template.";
            break;
    }
    return prompt;
}
