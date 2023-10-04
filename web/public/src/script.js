window.addEventListener("scroll", function () {
    var header = document.querySelector("header");
    if (window.scrollY > 0) {
        header.classList.add("scroll");
    } else {
        header.classList.remove("scroll");
    }
});



window.addEventListener('load', function () {

    const preloader = document.querySelector('.preloader');
    preloader.classList.add('active');

    // Disable scroll on the body tag
    document.body.classList.add('no-scroll');

    // Wait for 2 seconds, then hide the preloader
    setTimeout(function () {
        preloader.classList.remove('active');
        preloader.classList.add('hide');
        // Enable scroll on the body tag
        document.body.classList.remove('no-scroll');
    }, 0);

    const body = document.body;
    const toggleSwitch = document.querySelector('.toggle-switch input[type="checkbox"]');

    // Ajoutez la classe correspondant à l'état initial du mode sombre ou clair
    if (toggleSwitch.checked) {
        body.classList.add('dark-mode');
    } else {
        body.classList.add('light-mode');
    }

    toggleSwitch.addEventListener('change', switchTheme);
});

function switchTheme(event) {
    const body = document.body;
    const downloadSection = document.getElementById('download');

    if (event.target.checked) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        downloadSection.classList.remove('dark-mode-section'); 
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        downloadSection.classList.add('dark-mode-section');
    }
}
