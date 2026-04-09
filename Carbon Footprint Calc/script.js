document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("calculator-form");
    const resultsSection = document.getElementById("results-section");
    const totalEmissionsSpan = document.getElementById("total-emissions");
    const recalculateBtn = document.getElementById("recalculate-btn");
    const ctx = document.getElementById("compareChart").getContext("2d");
    
    let emissionChart = null; // Store chart instance to destroy it later
    const GLOBAL_AVERAGE = 4.7; // Global average CO2 emissions in tons

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload

        // 1. Gather values from the form
        const transport = parseFloat(form.elements["transport"].value);
        const flights = parseFloat(form.elements["flights"].value);
        const housing = parseFloat(form.elements["housing"].value);
        const electricity = parseFloat(form.elements["electricity"].value);

        // 2. Calculate Total
        const totalFootprint = (transport + flights + housing + electricity).toFixed(2);

        // 3. Display Result Text
        totalEmissionsSpan.textContent = totalFootprint;
        
        // Hide the form button, show the results
        document.getElementById("calculate-btn").parentElement.classList.add("hidden");
        resultsSection.classList.remove("hidden");

        // 4. Generate the Chart
        renderChart(parseFloat(totalFootprint));
    });

    // Handle Recalculate Button
    recalculateBtn.addEventListener("click", () => {
        // Reset the form selections
        form.reset();

        // Hide results, show calculate button again
        resultsSection.classList.add("hidden");
        document.getElementById("calculate-btn").parentElement.classList.remove("hidden");

        // Destroy the old chart so it can be redrawn fresh next time
        if (emissionChart) {
            emissionChart.destroy();
        }
        
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Function to render the Chart.js Bar Chart
    function renderChart(userTotal) {
        // Destroy existing chart if it exists to prevent overlapping bugs
        if (emissionChart) {
            emissionChart.destroy();
        }

        emissionChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Your Footprint", "Global Average"],
                datasets: [{
                    label: "Tons of CO₂ per year",
                    data: [userTotal, GLOBAL_AVERAGE],
                    backgroundColor: [
                        userTotal > GLOBAL_AVERAGE ? "#ef4444" : "#10b981", // Red if high, green if low
                        "#3b82f6" // Blue for global average
                    ],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Tons of CO₂'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide legend to keep it clean
                    }
                }
            }
        });
    }
});