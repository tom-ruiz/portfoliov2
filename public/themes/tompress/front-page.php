<?php
/**
*  Copyright (C) Tom Ruiz - All Rights Reserved.
*
*  This is proprietary software therefore it cannot be distributed or reselled.
*  Unauthorized copying of this file, via any medium is strictly prohibited.
*  Proprietary and confidential.
*
* @author    Tom Ruiz
* @copyright 2024.
* @license   Commercial license
*/
use Timber\Timber;


$context          = Timber::context();
$timber_post     = Timber::get_post();
$context['post'] = $timber_post;
$templates        = array( 'models/front-page.twig' );
Timber::render( $templates, $context );
