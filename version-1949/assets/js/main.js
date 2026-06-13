document.addEventListener("DOMContentLoaded", function () {
    var mobileToggle = document.getElementById("mobileToggle");
    var mobilePanel = document.getElementById("mobilePanel");

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var carousel = document.querySelector("[data-hero-carousel]");

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var prev = carousel.querySelector("[data-hero-prev]");
        var next = carousel.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        var showSlide = function (nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("is-active", itemIndex === index);
            });

            dots.forEach(function (dot) {
                var dotIndex = parseInt(dot.getAttribute("data-hero-dot"), 10);
                dot.classList.toggle("is-active", dotIndex === index);
            });
        };

        var start = function () {
            stop();
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        };

        var stop = function () {
            if (timer) {
                window.clearInterval(timer);
            }
        };

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(parseInt(dot.getAttribute("data-hero-dot"), 10));
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(index + 1);
                start();
            });
        }

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", start);
        showSlide(0);
        start();
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-card"));
    var emptyState = document.querySelector(".empty-state");

    if (filterInputs.length && cards.length) {
        var query = new URLSearchParams(window.location.search).get("q");
        var keywordInput = document.querySelector("[data-filter='keyword']");

        if (query && keywordInput) {
            keywordInput.value = query;
        }

        var applyFilters = function () {
            var values = {};

            filterInputs.forEach(function (input) {
                values[input.getAttribute("data-filter")] = (input.value || "").trim().toLowerCase();
            });

            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.textContent || "").toLowerCase();
                var title = (card.getAttribute("data-title") || "").toLowerCase();
                var tags = (card.getAttribute("data-tags") || "").toLowerCase();
                var region = (card.getAttribute("data-region") || "").toLowerCase();
                var year = (card.getAttribute("data-year") || "").toLowerCase();
                var type = (card.getAttribute("data-type") || "").toLowerCase();
                var category = (card.getAttribute("data-category") || "").toLowerCase();
                var keyword = values.keyword || "";
                var matchKeyword = !keyword || text.indexOf(keyword) !== -1 || title.indexOf(keyword) !== -1 || tags.indexOf(keyword) !== -1;
                var matchRegion = !values.region || region.indexOf(values.region) !== -1;
                var matchYear = !values.year || year === values.year;
                var matchType = !values.type || type.indexOf(values.type) !== -1;
                var matchCategory = !values.category || category === values.category;
                var matched = matchKeyword && matchRegion && matchYear && matchType && matchCategory;

                card.style.display = matched ? "" : "none";

                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visible === 0);
            }
        };

        filterInputs.forEach(function (input) {
            input.addEventListener("input", applyFilters);
            input.addEventListener("change", applyFilters);
        });

        applyFilters();
    }
});
