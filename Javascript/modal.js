window.onload = function () {
    var openModal = document.querySelector('.modal-btn');
    var modalBg = document.querySelector('.modal-bg');
    var closeModal = document.querySelector('#btnReset');

    openModal.addEventListener('click', function () {
        modalBg.classList.add('bg-active');
    });

    closeModal.addEventListener('click', function () {
        modalBg.classList.remove('bg-active');
    });

}