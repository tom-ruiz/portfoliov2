<?php
/**
 * Search results page
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 1.0
 */
$context = Timber::get_context();
$site = new TimberSite();
Timber::render( 'form/searchform.twig', $context );
