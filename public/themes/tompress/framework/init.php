<?php
/**
 *  Copyright (C) Tom Ruiz - All Rights Reserved.
 *
 *  This is proprietary software therefore it cannot be distributed or reselled.
 *  Unauthorized copying of this file, via any medium is strictly prohibited.
 *  Proprietary and confidential.
 *
 * @author   Tom Ruiz
 * @copyright 2024.
 * @license   Commercial license
 */

// Const env
define('ENV', env('WP_ENV'));

/*******************************************************************************************/
/* Système d'itération pour inclure toute la structure du framework
/*******************************************************************************************/
$helpers  = new RecursiveDirectoryIterator(get_template_directory().'/framework/helpers/', FilesystemIterator::SKIP_DOTS);
$iterator = new RecursiveIteratorIterator($helpers);
$phpfiles = new RegexIterator($iterator, '/^.+\.php$/i', RecursiveRegexIterator::GET_MATCH);
foreach ($phpfiles as $phpfile) {
    include_once $phpfile[0];
}

