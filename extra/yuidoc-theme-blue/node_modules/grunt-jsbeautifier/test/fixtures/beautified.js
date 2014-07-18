(function() {
    var b = 'some',
        c = !!b,
        some;

    // for some reason js-beautify adds spaces before and after
    // !!operator (double negation)
    // if (!!some) {
    if (!!some) {
        doSomething();
    }

    !!some && b && !c && doSomething();

    !!some || b || !c || doSomething();

    (!!some) && doSomething();

    console.log('try me!');
}());
