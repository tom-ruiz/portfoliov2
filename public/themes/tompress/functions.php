<?php

declare(strict_types=1);
require_once dirname(__FILE__).'/framework/init.php';

// Vérifiez si Timber est installé
if ( ! class_exists( 'Timber\Timber' ) ) {
    add_action( 'admin_notices', function() {
        echo '<div class="error"><p>Timber n\'est pas installé. Veuillez installer le plugin Timber.</p></div>';
    });
    return;
}

// Initialisez Timber
Timber\Timber::$dirname = array( 'templates', 'views', 'cms' );