module.exports = {
    src    : {
        index    : 'src/index.html',
        fonts    : 'src/lib/ionic/fonts/**.*',
        imgs     : 'src/img/**/**.*',
        path     : 'src/',
        lib      : 'src/lib/*',
        sass     : [
            'scss/*.scss',
            'scss/**/*.scss'
        ],
        css      : [
            'src/css/*.css',
            'src/css/**/*.css',
            'src/fonts/***.css',
            'src/module/**/*.css'
        ],
        js       : [
            'src/app/*.js',
            'src/app/**/*.js',
            '!src/app/**/*.spec.js',
            'src/component/**/*.js',
            '!src/component/**/*.spec.js',
            'src/component/*.js',
            'src/module/*.js',
            'src/module/**/*.js',
            '!src/module/**/*.spec.js',
            'src/js/*.js'
        ],
        html     : [
            'src/module/**/*.html'
        ],
        translate: [
            'src/app/**/*.js',
            'src/app/**/**/*.js',
            '!src/app/**/**/*.spec.js',
            'src/app/**/view/*.html',

            'src/component/**/*.js',
            '!src/component/**/**/*.spec.js',
            'src/component/**/view/*.html',

            'src/module/**/**/*.js',
            '!src/module/**/*.spec.js',
            'src/module/**/view/*.html'
        ]
    },
    libs   : [
        'src/lib/ionicons/fonts'
    ],
    sass   : 'scss/ionic.app.scss',
    source : 'src',
    dist   : 'www',
    docs   : 'docs',
    bower  : [
        'bower.json',
        '.bowerrc'
    ]
};
