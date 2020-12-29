/* Slider */
$('.owl-carousel').owlCarousel({
    loop:true,
    margin:50,
    autoplay: false,
    autoplayTimeout: 5000,
    slideTransition: 'linear',
    autoplaySpeed: 5000,
    autoplayHoverPause: false,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        600:{
            items:3,
            nav:false
        },
        1000:{
            items:5,
            nav:true,
        }
    }
})

document.getElementsByClassName('owl-prev')[0].innerHTML = '<i class="fas fa-4x fa-caret-left"></i>'

document.getElementsByClassName('owl-next')[0].innerHTML = '<i class="fas fa-4x fa-caret-right"></i>'
