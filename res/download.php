<?
	header("content-type: image");
	$homepage = file_get_contents($_GET['source']);
	echo $homepage;
?>