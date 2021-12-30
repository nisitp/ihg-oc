<?php
namespace Drupal\members_import;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\taxonomy\Entity\Term;

class ImportMembers {
  	
	public static function importNodes($alliedMemberIdsToDelete, $upadteAlliedMembers, $alliedMemberNodes, $termData, &$context){
    $message = 'Deleting / Importing / Updating Allied Members...';
    $results = array();
  
    //Delete Old Allied Member Nodes
    if(count($alliedMemberIdsToDelete) > 0){
      entity_delete_multiple('node', $alliedMemberIdsToDelete);
    }
  
    // get 
    
    foreach($alliedMemberNodes as $id => $alliedMember){
      
      // Process URL 
      if(isset($alliedMember['Website']) && !empty($alliedMember['Website'])){
        $memberWebsite  = $alliedMember['Website'];
        if((strpos($memberWebsite, 'http') === false)){
      		$memberWebsite = "https://".$memberWebsite;
      	}  
      }
      else{
        $memberWebsite = '';
      }
      
      // Process Member Logo url since it's not allowed to be stored with out .png , .jpg etc
      
      if(isset($alliedMember['Allied_Member_Logo_URLs__c']) && !empty($alliedMember['Allied_Member_Logo_URLs__c'])){       
    		$memberLogoUrl = htmlspecialchars_decode($alliedMember['Allied_Member_Logo_URLs__c']);
    		// Remove Latmod from Image Url
    		$key = 'lastMod';
    		$memberLogoUrl = preg_replace('/(.*)(?|&)'. $key .'=[^&]+?(&)(.*)/i', '$1$2$4', $memberLogoUrl .'&');
    		$memberLogoUrl = substr($memberLogoUrl, 0, -1);
    		$memberLogoUrl .= "&ext=tmp.jpg";
      }
      else{
        $memberLogoUrl = '';
      }
      
      
      // Category processing
      // Create Category if it doesn't exists other wise get the Id of it
      $categoryTids = array();
      if(isset($alliedMember['Allied_Member_Category__c']) && !empty($alliedMember['Allied_Member_Category__c'])){
        $category = explode(';', $alliedMember['Allied_Member_Category__c']);
        foreach($category as $termName){
          
          $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')
                ->loadByProperties(['name' => trim($termName), 'vid' => 'allied_member_category']);
          $term = reset($term);
          
          if($term){
            $categoryTids[] = $term->id();
          }
          else{
            // Create New term Here
            $term = Term::create([
              'name' => trim($termName),
              'vid' => 'allied_member_category',
            ]);
            $term->save();
            $categoryTids[] = $term->id();
          }
        }
      }  
      
      if (array_key_exists($id , $upadteAlliedMembers)) {
        //Update it
        $node = Node::load($upadteAlliedMembers[$id]);

        //Update Field Values
  
        $node->field_member_id->value = $alliedMember['Id'];
        $node->field_active->value = $alliedMember['Current_Allied_Member__c'] ? 1 : 0;
        $node->title->value = $alliedMember['Name'];
        $node->body->value = $alliedMember['Allied_Directory__c'];
        $node->body->format = 'basic_html';
        
        // check if file exists by uri
         
        if(isset($memberLogoUrl) && !empty($memberLogoUrl)){
        
          // Check if File exists by uri
          $files = \Drupal::entityTypeManager()
            ->getStorage('file')
            ->loadByProperties(['uri' => $memberLogoUrl]);
          
          if(count($files) > 0){
            foreach ($files as $fid => $f){
              $fileId = $fid;
            }
          }
          else{
            // No file exists by URI so create new one
            $file = File::Create(['uri' => $memberLogoUrl]);
            $file->save();
            $fileId = $file->id();
          }
          $node->field_member_logo->target_id = $fileId;
        }
        else{
          $node->field_member_logo->target_id = '';
        }
       
        $node->field_url->uri = $memberWebsite;
        $node->field_membership_category = $categoryTids;
        $node->field_membership_level->target_id = $termData[$alliedMember['Allied_Member_Types__c']];
        $node->changed->value = time();
        $node->created->value = time();
        // set node to publish
        //$node->status = 1;
        $node->setPublished(TRUE);
        //save to update node
        $node->save();
        $results[] = $id;
      }
      else{
        //Create New News Node
        if(isset($memberLogoUrl) && !empty($memberLogoUrl)){
          $file = File::Create(['uri' => $memberLogoUrl]);
          $file->save();
        }
        
        $values = array(
          'nid' => NULL,
          'type' => 'allied_member',
          'title' => $alliedMember['Name'],
          'uid' => 1,
          'status' => TRUE,
          'field_member_id' => $alliedMember['Id'],
          'field_active' => $alliedMember['Current_Allied_Member__c'] ? 1 : 0,
          'body' => array('value' => $alliedMember['Allied_Directory__c'], 'format' => 'basic_html'),
          'changed' => time(),
          'created' => time(),
          'field_url' => array('uri' => $memberWebsite),
          'field_member_logo' => $file ? array('target_id' => $file->id()) : '',
          'field_membership_level' => array('target_id' => $termData[$alliedMember['Allied_Member_Types__c']]),
          'field_membership_category' => $categoryTids,
          
        );
        
        entity_create('node', $values)->save();        
        $results[] = $id;
        //drupal_set_message( "Node with nid " . $node->id() . " saved!\n");
      }
    }
      
    $context['message'] = $message;
    $context['results'] = $results;
  }

  public static function importNodesFinishedCallback($success, $results, $operations) {
    // The 'success' parameter means no fatal PHP errors were detected. All
    // other error management should be handled using 'results'.
    if ($success) {
      $message = \Drupal::translation()->formatPlural(
        count($results),
        'One News processed.', '@count posts processed.'
      );
    }
    else {
      $message = t('Finished with an error.');
    }
    drupal_set_message($message);
  }

}
