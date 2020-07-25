const app = document.getElementById('root')

var request = new XMLHttpRequest()
request.open('GET', 'https://www.hpb.health.gov.lk/api/get-current-statistical', true)
request.onload = async function() {
    var result = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
        var local_1 = [result.data.local_new_cases,result.data.local_total_cases,result.data.local_active_cases]
        var topics_local_1 = ['New Cases', 'Total Cases', 'Active Cases']
        var img_local_1 = ['fas fa-ambulance',"fas fa-hospital","fas fa-procedures"]

        var local_2 = [result.data.local_recovered,result.data.local_deaths,result.data.local_total_number_of_individuals_in_hospitals]
        var topics_local_2 = ['Total Recovered','Total Deaths','Suspects']
        var img_local_2 = ["fas fa-running","fas fa-skull-crossbones","fas fa-diagnoses"]

        var global_1 = [result.data.global_new_cases,result.data.global_total_cases,result.data.global_deaths]
        var topics_global_1 = ['New Cases', 'Total Cases', 'Total Deaths']
        var img_global_1 = ['fas fa-ambulance',"fas fa-hospital","fas fa-skull-crossbones"]

        var global_2 = [result.data.global_new_deaths,result.data.global_recovered]
        var topics_global_2 = ['New Deaths', 'Total Recovered']
        var img_global_2 = ['fas fa-skull-crossbones',"fas fa-running"]

        var hos_data = result.data.hospital_data
        
        local1 = document.getElementById('local1')
        local2 = document.getElementById('local2')
        global1 = document.getElementById('global1')
        global2 = document.getElementById('global2')
        tbody = document.getElementById('tbody')

        function template(x,list1,list2,list3,type,div) {        
            for (i=0;i<x;i++){
                divlocal = document.createElement('div')
                divlocal.setAttribute('class','col-xs-4')
                div.appendChild(divlocal)
    
                divlocal2 = document.createElement('div')
                divlocal2.setAttribute('class','card text-white '+type+' mb-3')
                divlocal2.setAttribute('style','max-width: 18rem;')
                divlocal.appendChild(divlocal2)
    
                cardheader1 = document.createElement('div')
                cardheader1.setAttribute('class','card-header')
                divlocal2.appendChild(cardheader1)
    
                image = document.createElement('i')
                image.setAttribute('class',list3[i])
                const h2_1 = document.createElement('h4')
                cardheader1.appendChild(h2_1)
                h2_1.appendChild(image)
    
                cardbody1 = document.createElement('div')
                cardbody1.setAttribute('class','card-body')
                cardheader1.appendChild(cardbody1)
                const h5_1 = document.createElement('h5')
                h5_1.setAttribute('class','card-title')
                h5_1.textContent = list2[i]
                cardbody1.appendChild(h5_1)
                const h3_1 = document.createElement('h3')
                h3_1.setAttribute('class','card-text')
                h3_1.textContent = list1[i]
                cardbody1.appendChild(h3_1)
                
            }
        }
        
        template(3,local_1,topics_local_1,img_local_1,'bg-primary',local1)
        template(3,local_2,topics_local_2,img_local_2,'bg-primary',local2)
        template(3,global_1,topics_global_1,img_global_1,'bg-info',global1)
        template(2,global_2,topics_global_2,img_global_2,'bg-info',global2)

        document.getElementById('date').innerHTML = '<p>updated on <b>'+result.data.update_date_time +'</b></p>'
        
        for (i=0;i<hos_data.length;i++){
            const tr = document.createElement('tr')
            tbody.appendChild(tr)

            const td1 = document.createElement('td')
            td1.innerHTML = hos_data[i].hospital.name 
            const br = document.createElement('br')
            td1.appendChild(br)
            const p =document.createElement('p')
            p.textContent = hos_data[i].hospital.name_si
            td1.appendChild(p)
            tr.appendChild(td1)

            const td2 = document.createElement('td')
            td2.innerHTML = hos_data[i].cumulative_local
            tr.appendChild(td2)

            const td3 = document.createElement('td')
            td3.innerHTML = hos_data[i].cumulative_foreign
            tr.appendChild(td3)

            const td4 = document.createElement('td')
            td4.innerHTML = hos_data[i].treatment_local
            tr.appendChild(td4)

            const td5 = document.createElement('td')
            td5.innerHTML = hos_data[i].treatment_foreign
            tr.appendChild(td5)

        }

        var timeFrom = (X) => {
            var dates = [];
            for (let I = 0; I < Math.abs(X); I++) {
                var date = new Date(new Date().getTime() - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000));
                var day = date.getDate();
                var month = date.getMonth()+1;
                var year = date.getFullYear();
                const fulld = (Number(year)+'-'+Number(month)+'-'+Number(day));
                dates.push(fulld);
            }
            return dates;
        }

        var labels = timeFrom(7);
        var date = new Date(result.data.update_date_time);
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();
        const updated_fulld = (Number(year)+'-'+Number(month)+'-'+Number(day));
        var c = result.data.local_new_cases
        chrome.storage.sync.get(['data'], function(result) {
            data = result.data;
            if (labels[0] == data[7]){
                data[0] = c
            }else{
                if(updated_fulld == data[7]){
                    data[0] = c
                }
                else if(updated_fulld == labels[0]){
                    var data0 = [c]
                    var data1 = data.slice(0,6)
                    var data2 = [labels[0]]
                    var data = data0.concat(data1,data2)

                }
            }
            
            chrome.storage.sync.set({'data': data}, function() {
                console.log('Value is set to ' + data);
            });
            var dispay_data = data.slice(0,7)
            var ctx = document.getElementById("myChart").getContext('2d');
                  var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                    labels: labels,
                    datasets: [{
                    label: '# of Patients',
                    data: dispay_data,
                    backgroundColor: [
                    'rgba(54, 162, 235, 0.3)',
                    'rgba(54, 162, 235, 0.3)',
                    'rgba(54, 162, 235, 0.3)',
                    'rgba(54, 162, 235, 0.3)',
                    'rgba(54, 162, 235, 0.3)',
                    'rgba(54, 162, 235, 0.3)',
                    'rgba(54, 162, 235, 0.3)'
                    ],
                    borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                    }]
                    },
                    options: {
                    scales: {
                    yAxes: [{
                    ticks: {
                    beginAtZero: true
                    }
                    }]
                    }
                    }
                    });
        });
        
      
        

   }
}

request.send()