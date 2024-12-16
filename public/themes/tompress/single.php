<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */
use Timber\Timber;

$context         = Timber::context();
$timber_post     = Timber::get_post();
$context['post'] = $timber_post;

Timber::render( array( 'cms/single-' . $timber_post->ID . '.twig', 'cms/single-' . $timber_post->post_type . '.twig', 'cms/single-' . $timber_post->slug . '.twig', 'cms/single.twig' ), $context );
