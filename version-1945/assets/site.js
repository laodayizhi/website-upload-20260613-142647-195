document.addEventListener("DOMContentLoaded", function() {
    var toggle = document.querySelector(".mobile-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function() {
            mobileNav.classList.toggle("open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function(slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === activeIndex);
        });

        dots.forEach(function(dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === activeIndex);
        });
    }

    dots.forEach(function(dot) {
        dot.addEventListener("click", function() {
            showSlide(Number(dot.getAttribute("data-slide")) || 0);
        });
    });

    if (prev) {
        prev.addEventListener("click", function() {
            showSlide(activeIndex - 1);
        });
    }

    if (next) {
        next.addEventListener("click", function() {
            showSlide(activeIndex + 1);
        });
    }

    if (slides.length > 1) {
        window.setInterval(function() {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    document.querySelectorAll(".library-section, .quick-search-section, .rank-page-section").forEach(function(section) {
        var search = section.querySelector(".library-search");
        var year = section.querySelector(".year-filter");
        var region = section.querySelector(".region-filter");
        var type = section.querySelector(".type-filter");
        var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card, .rank-item"));
        var empty = section.querySelector(".filter-empty");

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilters() {
            var query = normalize(search ? search.value : "");
            var yearValue = normalize(year ? year.value : "");
            var regionValue = normalize(region ? region.value : "");
            var typeValue = normalize(type ? type.value : "");
            var visible = 0;

            cards.forEach(function(card) {
                var text = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-category"),
                    card.getAttribute("data-year")
                ].join(" "));
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchYear = !yearValue || normalize(card.getAttribute("data-year")) === yearValue;
                var matchRegion = !regionValue || normalize(card.getAttribute("data-region")) === regionValue;
                var matchType = !typeValue || normalize(card.getAttribute("data-type")) === typeValue;
                var show = matchQuery && matchYear && matchRegion && matchType;

                card.hidden = !show;

                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [search, year, region, type].forEach(function(control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });
    });
});
