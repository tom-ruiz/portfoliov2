<?php
/*******************************************************************************************/
/* Autres fonctions
/*******************************************************************************************/

// Fonction pour afficher la navigation des articles avec pagination
function tompress_navigation($the_query = null) {
    global $wp_query;

    $pagination = paginate_links(array(
        'prev_next' => true,
        'prev_text' => '&lt; ' . __('Previous', 'tompress'),
        'next_text' => __('Next', 'tompress') . ' &gt;',
        'type'      => 'array',
        'current'   => max(1, get_query_var('paged')),
        'total'     => $the_query ? $the_query->max_num_pages : $wp_query->max_num_pages,
    ));

    if (!empty($pagination)) {
        echo '<div class="row"><div class="col"><nav class="articles-navigation"><ul class="pagination justify-content-center">';
        foreach ($pagination as $p) {
            $active_class = strstr($p, 'current') !== false ? ' active' : '';
            echo '<li class="page-item' . $active_class . '">' . str_replace('page-numbers', 'page-link', $p) . '</li>';
        }
        echo '</ul></nav></div></div>';
    }
}

// Fonction pour compter les éléments d'un tableau de manière récursive
function count_recursive($array) {
    if (!is_array($array)) {
        return $array;
    }

    $count = 0;
    foreach ($array as $sub_array) {
        $count += count_recursive($sub_array);
    }

    return $count;
}
