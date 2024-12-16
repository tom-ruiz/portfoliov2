<?php

use Timber\Site;
use Timber\Timber;

Timber::$dirname = ['templates'];

class StarterSite extends Site
{
    public function __construct()
    {
        add_action('after_setup_theme', [$this, 'theme_supports']);
        add_filter('timber/context', [$this, 'add_to_context']);
        add_filter('timber/twig', [$this, 'add_to_twig']);
        parent::__construct();
    }

    public function add_to_context($context)
    {
        $context['site'] = $this;
        $context['menu'] = Timber::get_menu('primary');
        $context['theme_options'] = [];  // Placeholder for theme options
        $context['copyright'] = Timber::get_widgets('copyright');
        $context['is_home'] = is_front_page();
        
        // Footer dynamic sidebars
        $footer_columns = 4; // Replace with dynamic config if needed
        for ($i = 1; $i <= $footer_columns; $i++) {
            $context['dynamic_sidebar'][] = Timber::get_widgets("footer-$i");
        }

        return $context;
    }

    public function theme_supports()
    {
        load_theme_textdomain('compas', get_template_directory() . '/languages');

        add_theme_support('html5', ['search-form']);
        add_theme_support('post-thumbnails');
        add_post_type_support('page', 'excerpt');

        add_image_size('post_medium', 540, 405);

        register_nav_menu('primary', 'Top menu');
    }

    public function add_to_twig($twig)
    {
        $twig->addExtension(new Twig\Extension\StringLoaderExtension());
        return $twig;
    }

    public function menu()
    {
        return wp_nav_menu([
            'menu'           => 'primary',
            'theme_location' => 'primary',
            'depth'          => 2,
            'container'      => false,
            'echo'           => false,
            'menu_class'     => 'main-menu-mobile',
            'menu_id'        => 'main-menu-mobile',
        ]);
    }
}

new StarterSite();
