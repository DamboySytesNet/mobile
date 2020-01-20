exports.shake = (bell) => {
    bell
        .animate({
            rotate: 40,
            duration: 270,
            scale: {
                x: 1.3,
                y: 1.3
            }
        })
        .then(() => {
            return bell.animate({
                rotate: -40,
                duration: 270
            });
        })
        .then(() => {
            return bell.animate({
                rotate: 0,
                duration: 270,
                scale: {
                    x: 1,
                    y: 1
                }
            });
        });
}
