function mergeData(meetings, coordinates){
  for (let i = 0; i< meetings.length; i++){
    meetings[i].location.coordinate = {latitude: coordinates[i].latitude,longitude: coordinates[i].Longitude}; 
    
  }
  
}
