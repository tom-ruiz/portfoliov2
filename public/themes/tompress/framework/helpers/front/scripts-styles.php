<?php
/*******************************************************************************************/
/* Ajouts des medias en front
/*******************************************************************************************/
// Register scripts and styles.
add_action('wp_enqueue_scripts', function () {

    $manifestPath = get_theme_file_path('assets/.vite/manifest.json');
    if (
        wp_get_environment_type() === 'local' &&
        is_array(wp_remote_get('http://localhost:5173/')) // is Vite.js running
    ) {
        wp_enqueue_script('vite', 'http://localhost:5173/@vite/client', [], null);
        wp_enqueue_script('tompress', 'http://localhost:5173/resources/js/index.js', [], null);
        
    } elseif (file_exists($manifestPath)) {
        $manifest = json_decode(file_get_contents($manifestPath), true);
        wp_enqueue_script('tompress', get_theme_file_uri('assets/' . $manifest['resources/js/index.js']['file']), [], null);
        wp_enqueue_style('tompress', get_theme_file_uri('assets/' . $manifest['resources/js/index.js']['css'][0]), [], null);
    }
    //wp_enqueue_style('korolev-fonts', get_theme_file_uri('resources/css/fonts.css'), [], null);
    //wp_enqueue_style('runalto-fonts', get_theme_file_uri('resources/css/fonts.css'), [], null);

    //wp_enqueue_script('flickity-js', 'https://cdnjs.cloudflare.com/ajax/libs/flickity/2.3.1/flickity.min.js', array('jquery'), null, true);
    //wp_enqueue_script( 'hash-js', 'https://cdnjs.cloudflare.com/ajax/libs/flickity/2.2.2/flickity-hash.js', array('jquery', 'flickity-js'), null, true );
});

// Load scripts as modules.
add_filter('script_loader_tag', function (string $tag, string $handle, string $src) {
    if (in_array($handle, ['vite', 'tompress'])) {
        return '<script type="module" src="' . esc_url($src) . '" defer></script>';
    }

    return $tag;
}, 10, 3);

// Preload google assets
function tompress_preload() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
}
add_action('wp_head', 'tompress_preload', 0);
