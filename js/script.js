document.addEventListener("DOMContentLoaded", function () {

    // TOP TAB SWITCHING
    const topTabs = document.querySelectorAll(".top-tabs .tab");
    topTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            topTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // SUB-TAB SWITCHING (Log Calls, Tasks, etc.)
    const subTabs = document.querySelectorAll(".sub-tabs .sub-tab");
    subTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            subTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            const tabName = this.innerText.trim();
            console.log("Switching to section:", tabName);
        });
    });

    // PATH STEP CLICK ACTIVE
    const steps = document.querySelectorAll(".path .step");
    steps.forEach(step => {
        step.addEventListener("click", function () {
            let currentIndex = Array.from(steps).indexOf(this);
            steps.forEach((s, index) => {
                s.classList.remove("active", "completed");
                const indicator = s.querySelector(".indicator");
                if (index < currentIndex) {
                    s.classList.add("completed");
                    indicator.innerHTML = "✓";
                    indicator.className = "indicator check";
                } else if (index === currentIndex) {
                    s.classList.add("active");
                    indicator.innerHTML = "";
                    indicator.className = "indicator current";
                } else {
                    indicator.innerHTML = "";
                    indicator.className = "indicator";
                }
            });
        });
    });

    // TIMELINE EXPAND TOGGLE
    const timelineCards = document.querySelectorAll(".timeline-card");
    timelineCards.forEach(card => {
        const expandBtn = card.querySelector(".timeline-expand");
        if (expandBtn) {
            expandBtn.addEventListener("click", function () {
                card.classList.toggle("expanded");
                const desc = card.querySelector(".timeline-desc");
                if (desc) {
                    desc.style.display = card.classList.contains("expanded") ? "block" : "none";
                }
            });
        }
    });

    // FORM & TABLE LOGIC
    const form = document.getElementById("taskForm");
    const tableBody = document.querySelector(".data-table tbody");
    const viewMoreBtn = document.querySelector(".view-more-link");

    if (!tableBody) return;

    loadTasks();

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const subjectInput = document.querySelector(".styled-input[type='text']");
        const subject = subjectInput.value.trim();
        const selects = document.querySelectorAll("select");
        const dates = document.querySelectorAll("input[type='date']");

        const type = selects[0]?.value || "Task";
        const assignedTo = selects[1]?.value || "Not Assigned";
        const dueDate = dates[1]?.value || "";

        if (!subject) {
            alert("Please enter subject");
            return;
        }

        const newTask = {
            id: Date.now(),
            subject,
            type,
            assignedTo,
            dueDate,
            status: "Not Started"
        };

        saveTask(newTask);
        addRowToTable(newTask);

        const allRows = tableBody.querySelectorAll("tr");
        if (allRows.length > 4 && viewMoreBtn.style.display !== "none") {
            tableBody.lastChild.style.display = "none";
        }
        form.reset();
    });

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addRowToTable(task));
        updateViewMoreVisibility();
    }

    function updateViewMoreVisibility() {
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach((row, index) => {
            if (index < 4) {
                row.style.display = "table-row";
            } else {
                row.style.display = "none";
            }
        });

        if (viewMoreBtn) {
            viewMoreBtn.style.display = rows.length > 0 ? "inline-block" : "none";
        }
    }

    function addRowToTable(task) {
        const row = document.createElement("tr");
        const rowCount = tableBody.querySelectorAll("tr").length + 1;
        row.innerHTML = `
            <td>${rowCount}</td>
            <td><a href="#" class="sample-link">${task.subject}</a></td>
            <td>${task.type}</td>
            <td>${task.assignedTo}</td>
            <td>${formatDate(task.dueDate)}</td>
            <td>${task.status}</td>
        `;
        tableBody.appendChild(row);
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    }

    // VIEW MORE (INSIDE DOMContentLoaded)
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const rows = tableBody.querySelectorAll("tr");
            rows.forEach(row => {
                row.style.display = "table-row";
            });
            this.style.display = "none";
        });
    }
});