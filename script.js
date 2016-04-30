injectScript(function() {
    // HACKISH
    // fix popup shift
    var menuShift = false;
    $("#client-ui").bind("DOMSubtreeModified", function() {
        setTimeout(function() {
            if($("#client-ui #menu").length > 0 && !menuShift) {
                menuShift = true;
                var left = $("#client-ui #menu").css('left');
                $("#client-ui #menu").css('left', left.substring(0, left.length - 2)-50)+"px";
            } else if ($("#client-ui #menu").length == 0 && menuShift){
                menuShift = false;
            }
        }, 0);
    })

    //Insert the toolbar
    $("#client-ui").before("\
                            <div id='teams-toolbar'>\
                                <ul>\
                                </ul>\
                                <div id='add-team'>\
                                    <a href='https://slack.com/signin'>+<a>\
                                </div>\
                            </div>\
        ");
    var $teamsToolbar = $("#teams-toolbar");

    // Set the background color using color from the channels menu
    var colors = $("#col_channels_bg").css("background-color").split('(')[1].split(')')[0].split(','); // jquery return a rgb(x,y,z) value
    for(i in colors) {
        // Darken it
        colors[i] = (colors[i]<30) ? 0 : colors[i] - 30;
    }
    $teamsToolbar.css("background-color", "rgb("+colors[0]+","+colors[1]+","+colors[2]+")");

    // HACKISH
    // Fake call to the API to get current team icon
    TS.api.call("rtm.start").then(function(a){
        // Append current team first
        $("ul", $teamsToolbar).append("\
                                    <li class='active'>\
                                        <img src=" + a.data.team.icon.image_88 + " />\
                                    </li>");
        for(a in boot_data.other_accounts) {
            var account = boot_data.other_accounts[a];
            // Append others available teams
            $("ul", $teamsToolbar).append("\
                                        <li>\
                                            <a href='" + account.team_url + "' target='_self'>\
                                                <img src=" + account.team_icon.image_88 + " />\
                                            </a>\
                                        </li>")
        }
    });
});
