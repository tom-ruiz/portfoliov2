<?php

// Ajuster la qualité JPEG
add_filter('jpeg_quality', fn() => 100, 10, 2);

if (ENV == 'production') {
    // Nettoyage de l'en-tête WP
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'index_rel_link');
    remove_action('wp_head', 'parent_post_rel_link', 10, 0);
    remove_action('wp_head', 'start_post_rel_link', 10, 0);
    remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);

    // Masquer la barre d'administration et certaines pages de menu
    add_filter('show_admin_bar', '__return_false');
    add_filter('acf/settings/show_admin', '__return_false');
    add_action('admin_menu', 'remove_menus');
    
    // Masquer les notifications de mise à jour
    add_filter('pre_site_transient_update_plugins', 'remove_core_updates');
    add_filter('pre_site_transient_update_themes', 'remove_core_updates');
}

function remove_core_updates() {
    global $wp_version;
    return (object) array('last_checked' => time(), 'version_checked' => $wp_version);
}

function remove_menus() {
    remove_menu_page('edit-comments.php');
    remove_menu_page('tools.php');
    remove_menu_page('vc-general');
    remove_menu_page('social-warfare');
    remove_menu_page('responsive-lightbox-settings');
    remove_menu_page('users.php');
}

// Suppression des attributs de largeur et hauteur des images
function remove_width_attribute($html) {
    return preg_replace('/(width|height)="\d*"\s/', "", $html);
}
add_filter('post_thumbnail_html', 'remove_width_attribute', 10);
add_filter('image_send_to_editor', 'remove_width_attribute', 10);

// Suppression des chaînes de requête des ressources
function remove_query_strings($src) {
    $rqs = explode('?ver', $src);
    return $rqs[0];
}

if (!is_admin()) {
    add_filter('script_loader_src', 'remove_query_strings', 15, 1);
    add_filter('style_loader_src', 'remove_query_strings', 15, 1);
}

// Enregistrement des menus
function register_menus() {
    register_nav_menus(array(
        'main-menu' => __( 'Main menu' ),
        'top-bar-left' => __( 'Top bar left' ),
        'top-bar-right' => __( 'Top bar right' ),
    ));
}
add_action('init', 'register_menus');
