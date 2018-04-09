var login = $('#login');
var account = $('#account');
var posts = $('#posts');
var post_card = posts.find('#post_card');
var post = $('#post');
var next_page = null;


function submit_login_form(){

    var form = $('#login_form');


    var options = {
        url: 'http://192.168.109.150:80/api/main/login',
        type: 'post',
        success:function(data){
        console.log(data);
        }
    };
    form.ajaxForm(options);





    login.hide();
    account.show();

    return false;
}


$(function () {
    var response =$.getJSON('/api/posts').done(function (data) {
        next_page = data.next;
        data.posts.forEach(function (element, index, array){
            if (index == 0){
                post_card.find('p').text(element.body.substring(0, 100)+'......');
                post_card.find('h2').text(element.title);
                $.getJSON(element.author_url).done(function (data){
                    var str = moment(element.timestamp).fromNow() + ' by ' + '<a href="#">'+data.username+'</a>';
                    post_card.find('div.text-muted').html(str);
                    post_card.find('div.text-muted>a').click({user:data.url}, user);
                });
                post_card.find('div.card-body>a').click({url:element.url}, read_more);
                posts.append(post_card);
            }else{
                var new_post_card = post_card.clone();
                new_post_card.find('p').text(element.body.substring(0, 100)+'......');
                new_post_card.find('h2').text(element.title);
                $.getJSON(element.author_url).done(function (data){
                    var str = moment(element.timestamp).fromNow() + ' by ' + '<a href="#">'+data.username+'</a>';
                    new_post_card.find('div.text-muted').html(str);
                    new_post_card.find('div.text-muted>a').click({user:data.url}, user);
                });
                new_post_card.find('div.card-body>a').click({url:element.url}, read_more);
                posts.append(new_post_card);
            }
        });
        console.log(data);
    });
});

var isbool=true;
$(window).scroll(function(){
    var h=$(document.body).height();//网页文档的高度
    var c = $(document).scrollTop();//滚动条距离网页顶部的高度
    var wh = $(window).height(); //页面可视化区域高度
    if (isbool){
        if (Math.ceil(wh+c)>=h){
            isbool=false;
            var response =$.getJSON(next_page).done(function (data) {
                var posts = $('#posts');
                var post_card = posts.find('#post_card');
                next_page = data.next;
                data.posts.forEach(function (element, index, array){
                    var new_post_card = post_card.clone();
                    new_post_card.find('p').text(element.body.substring(0, 100)+'......');
                    new_post_card.find('h2').text(element.title);
                    $.getJSON(element.author_url).done(function (data){
                        var str = moment(element.timestamp).fromNow() + ' by ' + '<a href="#">'+data.username+'</a>';
                        new_post_card.find('div.text-muted').html(str);
                        new_post_card.find('div.text-muted>a').click({user:data.url}, user);
                    });
                    new_post_card.find('div.card-body>a').click({url:element.url}, read_more);
                    posts.append(new_post_card);
                });
                console.log(data);
                isbool=true;
            });
        }
    }
});


function read_more(post_url){
    isbool = false;
    var response =$.getJSON(post_url.data.url).done(function (data) {
        post.find('#post_title').text(data.title);
        post.find('#post_time').text(moment(data.timestamp).fromNow());
        post.find('#post_content').text(data.body);
        $.getJSON(data.author_url).done(function (data){
            post.find('#post_author').text(data.username);
            post.find('#post_author').off();
            post.find('#post_author').click({user:data.url}, user);
        });
        posts.hide();
        post.show();
        $('#back_p').show();
    });
}

function back_p(){
    isbool = true;
    post.hide();
    $('#back_p').hide();
    posts.show();
}

function user(user_url){
    var response =$.getJSON(user_url.data.user).done(function (data) {
        console.log(data)
    });
}

