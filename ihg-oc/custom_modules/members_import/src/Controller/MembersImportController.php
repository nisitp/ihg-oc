<?php

namespace Drupal\members_import\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;


/**
 * Class MembersImportController.
 */
class MembersImportController extends ControllerBase {
  
  // array(MemberId => Nid)
  private $existingAlliedMemberIds;
  // array(MemberId => Nid)
  private $alliedMemberIdsToDelete;
  private $upadteAlliedMembers;
  private $alliedMemberIds;
  private $alliedMemberNodes;
  private $termData;
  
  public function __construct(){
    
    $this->alliedMemberIds = array();
    $this->alliedMemberNodes = array();
    $this->alliedMemberIdsToDelete = array();
    
    // Get existing alliedMemberIds here
    $query = \Drupal::database()->select('node__field_member_id', 'n1');
    $query->fields('n1', array('field_member_id_value','entity_id'));
    $query->condition('bundle', 'allied_member');
    $query->condition('deleted', '0');
    $this->existingAlliedMemberIds = $query->execute()->fetchAllKeyed();    
    
   
    // Load allied_member_levels taxonomy name => id
    $vid = 'allied_member_levels';
    $this->termData = array();
    $terms =\Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
    foreach ($terms as $term) {
      $this->termData[$term->name] = $term->tid;
    }
  }
  
	/**
 		* GetAlliedMembers.
 		*
 		*
 	*/
	public function getAlliedMembers() {
			
    $dataArray =  array('Request' => array('Name' => 'HotSauceAlliedMembersInfo', 'AuthenticationKey' => 'D341F646B6DF7943DD456625B56AD')); 
    $data_string = json_encode($dataArray); 

    $ch = curl_init('https://hub.owners.org/services/apexrest/NUINT/NUIntegrationService');
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');                                                                     
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);   
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);                                                                   
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
      'Content-Type: application/json',                                                                                
      'Content-Length: ' . strlen($data_string))                                                                       
    );                                                                                                                   
       
		$data = curl_exec($ch);
		$data = json_decode($data, TRUE);
		$dataRecords = $data['Records'];
		curl_close($ch);
		
		
		if(count($dataRecords) == 0){
      // Error
      if(!empty($data['Message'])){
        $errorMessage = $data['Message'];
        echo "Failed Here with a message: ". $errorMessage; 
      }
    }
    else{
      // Success
      if(count($dataRecords) > 0){ 
        foreach($dataRecords as $record){
          $id = $record['Id'];          
          $this->alliedMemberIds[] = $id;
          $this->alliedMemberNodes[$id] = $record;
        }
      
        // Determine Existing Nodes to deletes if they are not present in $alliedMemberIds
        if(count($this->existingAlliedMemberIds) > 0){
          foreach($this->existingAlliedMemberIds as $id => $nid){
            if(!in_array($id, $this->alliedMemberIds)){
              $this->alliedMemberIdsToDelete[] = $nid;
            }
            else{
              $this->upadteAlliedMembers[$id] = $nid;
            }
          }
        }
        
        $batch = array(
          'title' => $this->t('Allied Member Imports'),
          'operations' => array(
            array('\Drupal\members_import\ImportMembers::importNodes',array($this->alliedMemberIdsToDelete , $this->upadteAlliedMembers, $this->alliedMemberNodes, $this->termData)),
          ),
          'finished' => '\Drupal\members_import\ImportMembers::importNodesFinishedCallback',
        );
        batch_set($batch);
        return batch_process('user');
      }
    }
	}
}


