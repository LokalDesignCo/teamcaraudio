import { getVehicleYears, getVehicleMakes, getVehicleModels, submitToShopMonkey } from 'backend/shopmonkeyAPI';

$w.onReady(function () {
    populateYears();
    populateServices();
    
    $w("#yearDropdown").onChange(() => {
        populateMakes();
    });
    
    $w("#makeDropdown").onChange(() => {
        populateModels();
    });
    
    $w("#submitButton").onClick(() => {
        handleFormSubmit();
    });
});

// ============= VEHICLE DROPDOWN POPULATION (Using ShopMonkey API) =============

async function populateYears() {
    try {
        $w("#yearDropdown").placeholder = "Loading years...";
        
        // Get years from ShopMonkey API
        const result = await getVehicleYears();
        
        if (result.success && result.data) {
            const years = result.data.map(year => ({
                label: String(year),
                value: String(year)
            }));
            
            years.push({ label: "Other", value: "other" });
            $w("#yearDropdown").options = years;
        } else {
            // Fallback to manual years if API fails
            const currentYear = new Date().getFullYear();
            const years = [];
            
            for (let i = 0; i <= 30; i++) {
                const year = currentYear - i;
                years.push({
                    label: String(year),
                    value: String(year)
                });
            }
            
            years.push({ label: "Other", value: "other" });
            $w("#yearDropdown").options = years;
        }
    } catch (error) {
        console.error("Error loading years:", error);
    } finally {
        $w("#yearDropdown").placeholder = "Year";
    }
}

async function populateMakes() {
    const selectedYear = $w("#yearDropdown").value;
    
    if (!selectedYear || selectedYear === "other") {
        $w("#makeDropdown").options = [{ label: "Other", value: "other" }];
        $w("#modelDropdown").options = [];
        return;
    }
    
    $w("#makeDropdown").placeholder = "Loading makes...";
    $w("#makeDropdown").disable();
    
    try {
        // Get makes from ShopMonkey API
        const result = await getVehicleMakes(selectedYear);
        
        if (result.success && result.data && result.data.length > 0) {
            const makes = result.data
                .map(item => ({
                    label: item.make,
                    value: item.makeId.toString(),
                    makeId: item.makeId
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
            
            makes.push({ label: "Other", value: "other" });
            $w("#makeDropdown").options = makes;
        } else {
            $w("#makeDropdown").options = [{ label: "Other", value: "other" }];
        }
    } catch (error) {
        console.error("Error fetching makes:", error);
        $w("#makeDropdown").options = [{ label: "Other", value: "other" }];
    } finally {
        $w("#makeDropdown").placeholder = "Make";
        $w("#makeDropdown").enable();
    }
    
    $w("#modelDropdown").options = [];
}

async function populateModels() {
    const selectedYear = $w("#yearDropdown").value;
    const selectedMakeId = $w("#makeDropdown").value;
    
    if (!selectedMakeId || selectedMakeId === "other" || !selectedYear || selectedYear === "other") {
        $w("#modelDropdown").options = [{ label: "Other", value: "other" }];
        return;
    }
    
    $w("#modelDropdown").placeholder = "Loading models...";
    $w("#modelDropdown").disable();
    
    try {
        // Get models from ShopMonkey API
        const result = await getVehicleModels(selectedYear, selectedMakeId);
        
        if (result.success && result.data && result.data.length > 0) {
            const models = result.data
                .map(item => ({
                    label: item.model,
                    value: item.modelId.toString(),
                    modelId: item.modelId
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
            
            models.push({ label: "Other", value: "other" });
            $w("#modelDropdown").options = models;
        } else {
            $w("#modelDropdown").options = [{ label: "Other", value: "other" }];
        }
    } catch (error) {
        console.error("Error fetching models:", error);
        $w("#modelDropdown").options = [{ label: "Other", value: "other" }];
    } finally {
        $w("#modelDropdown").placeholder = "Model";
        $w("#modelDropdown").enable();
    }
}

function populateServices() {
    const services = [
        { label: "Car Audio & Speaker Upgrades", value: "car-audio-speakers" },
        { label: "Remote Start & Security Systems", value: "remote-start-security" },
        { label: "Apple CarPlay & Android Auto Installation", value: "carplay-android-auto" },
        { label: "Marine, ATV, & Golf Cart Audio", value: "marine-atv-golf-cart" },
        { label: "Custom Installs & Lighting", value: "custom-installs-lighting" },
        { label: "Other", value: "other" }
    ];
    
    $w("#serviceDropdown").options = services;
}

// ============= HELPER FUNCTIONS =============

function getSelectedLabel(dropdown) {
    try {
        // First try using selectedIndices
        const selectedIndices = dropdown.selectedIndices;
        if (selectedIndices && selectedIndices.length > 0) {
            const index = selectedIndices[0];
            const options = dropdown.options;
            if (options && options[index] && options[index].label) {
                return options[index].label;
            }
        }
        
        // Fallback: find the option by matching the value
        const selectedValue = dropdown.value;
        const options = dropdown.options;
        if (selectedValue && options) {
            const matchingOption = options.find(opt => opt.value === selectedValue);
            if (matchingOption && matchingOption.label) {
                console.log(`Found label by value matching: ${matchingOption.label}`);
                return matchingOption.label;
            }
        }
        
        // Last resort fallback
        console.warn("Could not get label for dropdown, returning empty string");
        return "";
    } catch (error) {
        console.error("Error getting selected label:", error);
        return "";
    }
}

// ============= FORM VALIDATION =============

function validateForm() {
    let isValid = true;
    
    if (!$w("#firstNameInput").value || $w("#firstNameInput").value.trim() === "") {
        $w("#firstNameInput").updateValidityIndication();
        isValid = false;
    }
    
    if (!$w("#lastNameInput").value || $w("#lastNameInput").value.trim() === "") {
        $w("#lastNameInput").updateValidityIndication();
        isValid = false;
    }
    
    const phone = $w("#phoneInput").value;
    if (!phone || phone.trim() === "") {
        $w("#phoneInput").updateValidityIndication();
        isValid = false;
    }
    
    const email = $w("#emailInput").value;
    if (!email || !email.includes('@')) {
        $w("#emailInput").updateValidityIndication();
        isValid = false;
    }
    
    if (!$w("#yearDropdown").value) {
        isValid = false;
    }
    
    if (!$w("#makeDropdown").value) {
        isValid = false;
    }
    
    if (!$w("#modelDropdown").value) {
        isValid = false;
    }
    
    if (!$w("#serviceDropdown").value) {
        isValid = false;
    }
    
    return isValid;
}

// ============= FORM SUBMISSION =============

async function handleFormSubmit() {
    if (!validateForm()) {
        $w("#submitButton").label = "Please fill all required fields";
        setTimeout(() => {
            $w("#submitButton").label = "Submit";
        }, 3000);
        return;
    }
    
    $w("#submitButton").disable();
    $w("#submitButton").label = "Submitting...";
    
    // Collect form data with safe label extraction
    const formData = {
        firstName: $w("#firstNameInput").value,
        lastName: $w("#lastNameInput").value,
        phone: $w("#phoneInput").value,
        email: $w("#emailInput").value,
        year: $w("#yearDropdown").value,
        makeId: $w("#makeDropdown").value,
        makeName: getSelectedLabel($w("#makeDropdown")),
        modelId: $w("#modelDropdown").value,
        modelName: getSelectedLabel($w("#modelDropdown")),
        service: getSelectedLabel($w("#serviceDropdown")),
        preferredTimeline: $w("#timelineInput").value || "",
        additionalDetails: $w("#detailsTextBox").value || ""
    };
    
    // Debug logging
    console.log("Form data before submission:", {
        makeId: formData.makeId,
        makeName: formData.makeName,
        modelId: formData.modelId,
        modelName: formData.modelName,
        makeDropdownOptions: $w("#makeDropdown").options,
        modelDropdownOptions: $w("#modelDropdown").options
    });
    
    try {
        // Call secure backend function
        const result = await submitToShopMonkey(formData);
        
        if (result.success) {
            $w("#submitButton").label = "Success! ✓";
            console.log("Form submitted successfully!");
            
            // Optional: Show success message or redirect
            setTimeout(() => {
                resetForm();
            }, 2000);
        } else {
            throw new Error(result.error || "Submission failed");
        }
        
    } catch (error) {
        console.error("Form submission error:", error);
        const errorMsg = error.message || "Unknown error";
        $w("#submitButton").label = `Error: ${errorMsg.substring(0, 30)}...`;
        $w("#submitButton").enable();
        
        // Show full error in console
        console.error("Full error details:", {
            message: errorMsg,
            formData: {
                year: formData.year,
                makeId: formData.makeId,
                makeName: formData.makeName,
                modelId: formData.modelId,
                modelName: formData.modelName
            }
        });
        
        setTimeout(() => {
            $w("#submitButton").label = "Submit";
        }, 5000);
    }
}

function resetForm() {
    $w("#firstNameInput").value = "";
    $w("#lastNameInput").value = "";
    $w("#phoneInput").value = "";
    $w("#emailInput").value = "";
    $w("#yearDropdown").value = undefined;
    $w("#makeDropdown").value = undefined;
    $w("#modelDropdown").value = undefined;
    $w("#serviceDropdown").value = undefined;
    $w("#timelineInput").value = "";
    $w("#detailsTextBox").value = "";
    
    $w("#submitButton").label = "Submit";
    $w("#submitButton").enable();
}