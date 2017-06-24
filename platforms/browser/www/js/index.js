/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

//AJAX CUTRADAS
/*$$('form.ajax-submit').on('submit', function(){
    var formData = myApp.formToData(this);
    console.log(formData);
    var date = formData.dia;
    var hora = formData.hora;

});*/
var today = new Date();
 
var pickerInline = myApp.picker({
    input: '#picker-date',
    container: '#picker-date-container',
    toolbar: false,
    rotateEffect: true,
 
    value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],
 
    onChange: function (picker, values, displayValues) {
        var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
        if (values[1] > daysInMonth) {
            picker.cols[1].setValue(daysInMonth);
        }
    },
 
    formatValue: function (p, values, displayValues) {
        return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
    },
 
    cols: [
        // Months
        {
            values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
            displayValues: ('January February March April May June July August September October November December').split(' '),
            textAlign: 'left'
        },
        // Days
        {
            values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        },
        // Years
        {
            values: (function () {
                var arr = [];
                for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                return arr;
            })(),
        },
        // Space divider
        {
            divider: true,
            content: '  '
        },
        // Hours
        {
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 23; i++) { arr.push(i); }
                return arr;
            })(),
        },
        // Divider
        {
            divider: true,
            content: ':'
        },
        // Minutes
        {
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                return arr;
            })(),
        }
    ]
});  
           
var formData;

$$('form.ajax-submit.vol').on('form:beforesend', function(e){
formData = myApp.formToData('form.ajax-submit.vol');
console.log(formData.arrival_time);
});


$$('form.ajax-submit.register').on('form:success', function(e){
    var data = JSON.parse(e.detail.data);
    if(data.success){
        userid = data.userid;
        window.location.href="index.html";
    }else{
        alert('Hay algún dato erroneo');
    }
});

$$('form.ajax-submit.login').on('form:success', function(e){
    var data = JSON.parse(e.detail.data);
    if(data.success){
        userid = data.userid;
        window.location.href="index.html";
    }else{
        alert('Las credenciales no coincide');
    }
});

$$('form.ajax-submit.vol').on('form:success', function(e){
    var xhr = e.detail.xhr;
    var data = e.detail.data;
    json_vols_simples = JSON.parse(data);
    $$('#redirect-to-routes-picker').click();
    
    setTimeout(function(){
        $$('#routes-picker-list').append('<div class="list-block-label">Autobus</div>');
        $$('#routes-picker-list').append('<ul><li><a href="best_bus.html" class="item-link item-content"><div class="item-inner"><div class="item-title">Arribada: ' + json_vols_simples.best_bus.arrival + 'h</div><div class="item-after">' + json_vols_simples.best_bus.duration + '</div></div></a></li></ul>');
        $$('#routes-picker-list').append('<div class="list-block-label">Tren</div>');
        $$('#routes-picker-list').append('<ul><li><a href="best_train.html" class="item-link item-content"><div class="item-inner"><div class="item-title">Arribada: ' + json_vols_simples.best_train.arrival + 'h</div><div class="item-after">' + json_vols_simples.best_train.duration + '</div></div></a></li></ul>');
        $$('#routes-picker-list').append('<div class="list-block-label">Combinació</div>');
        $$('#routes-picker-list').append('<ul><li><a href="best.html" class="item-link item-content"><div class="item-inner"><div class="item-title">Arribada: ' + json_vols_simples.best.arrival + 'h</div><div class="item-after">' + json_vols_simples.best.duration + '</div></div></a></li></ul>');
    }, 1000);
    
    //window.location.href = "routes_picker.html";
});

myApp.onPageInit('best-bus', function(page){
    $$.post('http://localhost/SOMHackathon17/public/bestroute/complex', {
        arrival_time: formData.arrival_time,
        origin: formData.origin,
        destination: formData.destination,
        which: 'bus'
    }, function(data){
        json_vol_complexe = JSON.parse(data);
        $$('#origin').append(json_vol_complexe.departure);
        $$('#destination').append(json_vol_complexe.arrival);
        $$('#duration').append(json_vol_complexe.duration);
        $$('#distance').append(json_vol_complexe.distance);

        $$.each(json_vol_complexe.steps, function(i, step){
            $$('#steps').append('<div class="item-subtitle">' + step.info + '</div>');
        });
    });
});

myApp.onPageInit('best-train', function(page){
    $$.post('http://localhost/SOMHackathon17/public/bestroute/complex', {
        arrival_time: formData.arrival_time,
        origin: formData.origin,
        destination: formData.destination,
        which: 'train'
    }, function(data){
        json_vol_complexe = JSON.parse(data);
        $$('#origin').append(json_vol_complexe.departure);
        $$('#destination').append(json_vol_complexe.arrival);
        $$('#duration').append(json_vol_complexe.duration);
        $$('#distance').append(json_vol_complexe.distance);

        $$.each(json_vol_complexe.steps, function(i, step){
            $$('#steps').append('<div class="item-subtitle">' + step.info + '</div>');
        });
    });
});
myApp.onPageInit('best-mix', function(page){
    $$.post('http://localhost/SOMHackathon17/public/bestroute/complex', {
        arrival_time: formData.arrival_time,
        origin: formData.origin,
        destination: formData.destination,
        which: 'mix'
    }, function(data){
        json_vol_complexe = JSON.parse(data);
        $$('#origin').append(json_vol_complexe.departure);
        $$('#destination').append(json_vol_complexe.arrival);
        $$('#duration').append(json_vol_complexe.duration);
        $$('#distance').append(json_vol_complexe.distance);

        $$.each(json_vol_complexe.steps, function(i, step){
            $$('#steps').append('<div class="item-subtitle">' + step.info + '</div>');
        });
    });
});

$$("#btn-comprar").click(function(){
    $$.post('http://localhost/SOMHackathon17/public/save/flight', {
        arrival_time: formData.arrival_time,
        origin: formData.origin,
        destination: formData.destination,
        which: 'mix',
        userid: userid,
        json: json_vol_complexe
    }, function(data){
        json_vol_complexe = JSON.parse(data);
        $$('#origin').append(json_vol_complexe.departure);
        $$('#destination').append(json_vol_complexe.arrival);
        $$('#duration').append(json_vol_complexe.duration);
        $$('#distance').append(json_vol_complexe.distance);

        $$.each(json_vol_complexe.steps, function(i, step){
            $$('#steps').append('<div class="item-subtitle">' + step.info + '</div>');
        });
    });
});

