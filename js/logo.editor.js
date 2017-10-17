/*!combi2017-07-20*/
$.svgEditor = function(a, b) {
    var c = this;
    return c.defaults = {
        svg: SVG(a),
        logo: SVG.get("svg-logo"),
        name: SVG.get("svg-name"),
        slogan: SVG.get("svg-slogan"),
        atext: SVG.get("svg-atext")
    },
    b = $.extend(!0, c.defaults, {
        data: b
    }),
    c.init = function() {
        b.svg.viewbox(0, 0, 670, 500),
        b.svg.box = b.svg.rbox(),
        b.logo.box = b.logo.rbox(),
        b.ghost || (b.ghost = b.svg.group().id("svg-ghost")),
        b.ghost.clear(),
        b.cur = "",
        b.svg.select(".svg-element").style("cursor", "pointer").off("click").on("click",
        function(a) {
            c.selected(this),
            a.stopPropagation()
        });
        var a = 0;
        return c.setText(b, function() {
            c.layout(b),
            c.selected(b.name),
            $(".svg-loading").remove(),
            $(".btn-checkout").prop("disabled", 0),
            a || (a = 1)
        }),
        $(".js-svg-fonts .Moption[data-chinese=0]").hide(),
        $(".js-svg-fonts .Moption").off("click").on("click",function() {
            var a = $(this).data("src");
            if (b.cur) {
                switch ($(b.cur.node).attr("id")) {
                case "svg-name":
                    b.data.name.font = a;
                    break;
                case "svg-slogan":
                    b.data.slogan.font = a;
                    break;
                case "svg-atext":
                    b.data.atext.font = a
                }
                c.setText(b,function() {
                    $.selected(b.cur)
                })
            }
        }),
        $(".js-svg-layout li").off("click").on("click", function() {
            $(this).addClass('active').siblings().removeClass('active');
            var a = $(this).data("id");
            b.data.layout = a,
            c.layout(b)
        }),
        $(".js-svg-name").val(b.data.name.text),
        $(".js-svg-name-btn").off("click").on("click", function() {
            var a = $(".js-svg-name").val();
            b.data.name.text = a,
            b.ghost.clear(),
            c.setText(b)
        }),
        $(".js-svg-slogan").val(b.data.slogan.text),
        $(".js-svg-slogan-btn").off("click").on("click",
        function() {
            var a = $(".js-svg-slogan").val();
            b.data.slogan.text = a,
            b.ghost.clear(),
            c.setText(b)
        }),
        $(".svg-atext-ipt .form-control").val(b.data.atext.text),
        $(".svg-atext-ipt .btn").off("click").on("click",
        function() {
            var a = $(".svg-atext-ipt .form-control").val();
            b.data.atext.text = a,
            b.ghost.clear(),
            c.setText(b)
        }),
        $(".hide-slogan").off("click").on("click",
        function() {
            this.checked ? $("#svg-slogan").hide() : $("#svg-slogan").show()
        }),
        $(".append-text").off("click").on("click",
        function() {
            var a = $(".append-text-ipt .form-control").val();
            this.checked ? ($(".append-text-ipt").show(), $("#svg-atext").show(), b.data.atext.text = a) : ($(".append-text-ipt").hide(), $("#svg-atext").hide(), b.data.atext.text = ""),
            c.setText(b)
        }),
        c
    },
    c.setText = function(a, b) {
        a.data.name.text && (a.data.name.font = a.data.name.font ? a.data.name.font: "/fonts/cn/fzhzgbjt.ttf", opentype.load(a.data.name.font,
        function(c, d) {
            if (c) return console.log(d),
            void console.log("Font could not be loaded: " + c);
            var e = d.getPath(a.data.name.text, 0, 40, 50);
            $("#svg-name").html('<g transform="matrix(1,0,0,1,0,0)" fill="#3e3a39">' + e.toSVG() + "</g>"),
            b && b()
        })),
        a.data.slogan.text && (a.data.slogan.font = a.data.slogan.font ? a.data.slogan.font: "/fonts/cn/fzhzgbjt.ttf", opentype.load(a.data.slogan.font,
        function(c, d) {
            if (c) return console.log(d),
            void console.log("Font could not be loaded: " + c);
            var e = d.getPath(a.data.slogan.text, 0, 30, 25);
            $("#svg-slogan").html('<g transform="matrix(1,0,0,1,0,0)" fill="#888888">' + e.toSVG() + "</g>"),
            b && b()
        })),
        a.data.atext.text && (a.data.atext.font = a.data.atext.font ? a.data.atext.font: "/fonts/cn/fzhzgbjt.ttf", opentype.load(a.data.atext.font,
        function(c, d) {
            if (c) return console.log(d),
            void console.log("Font could not be loaded: " + c);
            var e = d.getPath(a.data.atext.text, 0, 30, 25);
            $("#svg-atext").html('<g transform="matrix(1,0,0,1,0,0)" fill="#888888">' + e.toSVG() + "</g>"),
            b && b()
        }))
    },
    c.layout = function(a) {
        a.logo.transform(new SVG.Matrix(1, 0, 0, 1, 0, 0)),
        a.svg.select(".svg-element").each(function() {
            var b = this.rbox(),
            c = this.bbox(),
            d = a.svg.box.w / 2 - b.w / 2 - c.x,
            e = a.svg.box.h / 2 - b.h / 2 - c.y;
            this.move(d, e)
        });
        var b = a.logo.rbox().w > a.logo.rbox().h ? 160 / a.logo.rbox().w: 160 / a.logo.rbox().h;
        switch (a.logo.scale(b, b), a.data.layout) {
        case 2:
            b = .6 * b,
            a.logo.scale(b, b);
            var c = 60,
            d = a.name.rbox().w > a.slogan.rbox().w ? a.name.rbox().w: a.slogan.rbox().w,
            e = a.logo.rbox().w + d,
            f = a.svg.box.w / 2 - e / 2 - c;
            a.logo.x(f - c),
            a.name.dy( - 10).x(f + a.logo.rbox().w + c),
            a.slogan.dy(30).x(f + a.logo.rbox().w + c);
            break;
        case 1:
        default:
            a.logo.dy( - 60),
            a.name.dy(70),
            a.slogan.dy(110)
        }
        a.ghost.clear()
    },
    c.bindColorPicker = function(a, b, c) {
        seajs.use(["/js/plugin/colorpicker/bootstrap.colorpickersliders.css", "/js/plugin/colorpicker/tinycolor.min.js", "/js/plugin/colorpicker/bootstrap.colorpickersliders.js"],
        function() {
            var d = function(a) {
                for (var b = a.toString().match(/\d+/g), c = "#", d = 0; 3 > d; d++) c += ("0" + Number(b[d]).toString(16)).slice( - 2);
                return c
            },
            e = function(a) {
                var b = [],
                c = [];
                if (a = a.replace(/#/, ""), 3 == a.length) {
                    for (var d = [], e = 0; 3 > e; e++) d.push(a.charAt(e) + a.charAt(e));
                    a = d.join("")
                }
                for (var e = 0; 3 > e; e++) b[e] = "0x" + a.substr(2 * e, 2),
                c.push(parseInt(Number(b[e])));
                return "rgb(" + c.join(",") + ")"
            },
            f = ["c00000", "ff0000", "ffc000", "ffff00", "92d050", "00b050", "00b0f0", "0070c0", "002060", "7030a0", "f2f2f2", "7f7f7f", "ddd9c3", "c6d9f0", "dbe5f1", "f2dcdb", "ebf1dd", "e5e0ec", "dbeef3", "fdeada", "d8d8d8", "595959", "c4bd97", "8db3e2", "b8cce4", "e5b9b7", "d7e3bc", "ccc1d9", "b7dde8", "fbd5b5", "bfbfbf", "3f3f3f", "938953", "548dd4", "95b3d7", "d99694", "c3d69b", "b2a2c7", "92cddc", "fac08f", "a5a5a5", "262626", "494429", "17365d", "366092", "953734", "76923c", "5f497a", "31859b", "e36c09", "7f7f7f", "0c0c0c", "1d1b10", "0f243e", "244061", "632423", "4f6128", "3f3151", "205867", "974806"],
            g = '<div class="picker-color-box"><div class="title">常用颜色：</div><div class="picker-color-cards js-color-cards"></div><div class="title">自定义：</div><div class="color-picker js-color-picker"></div></div>';
            $(a).append(g);
            for (x in f) {
                var h = f[x],
                i = '<a href="javascript:;" style="background-color:#' + h + '" data-color="' + h + '"></a>';
                $(".js-color-cards", a).append(i)
            }
            $(".js-color-picker", a).ColorPickerSliders({
                color: b,
                flat: !0,
                sliders: !1,
                swatches: !1,
                hsvpanel: !0,
                onchange: function(a, b) {
                    var e = "rgba(" + b.rgba.r + "," + b.rgba.g + "," + b.rgba.b + "," + b.rgba.a + ")";
                    c(d(e), e, "custom")
                }
            }),
            $(".js-color-cards a", a).on("click", function() {
                $(this).addClass("active"),
                $(this).siblings().removeClass("active");
                var a = $(this).data("color");
                c("#" + a, e("#" + a), "standard")
            })
        })
    },
    c.svgColor = function(a) {
        var b = {},
        d = $(a).html(),
        e = d.match(/\#[0-9a-fA-F]{3,6}/g);
        for (var f in e) {
            if (f >= 12) break;
            var g = e[f];
            b[g] = g
        }
        $(".js-svg-color").empty();
        for (var h in b) $(".js-svg-color").append('<li><a class="color" style="background:' + b[h] + '" data-bg="' + b[h] + '"></a></li>');
        $(".js-svg-color a").off("click").on("click",function(b) {
            $(".picker-color-box").remove();
            var e = this,
            f = $(this).data("bg");
            c.bindColorPicker($(this).parent(), f,
            function(c, g, h) {
                var i = new RegExp(f, "g");
                d = d.replace(i, c),
                f = c,
                $(e).css("background", c).data("bg", c),
                $(a).html(d),
                b.stopPropagation()
            }),
            $(document).on("click",function() {
                $(".picker-color-box").hide()
            })
        })
    },
    c.selected = function(a) {
        switch (b.el = a, b.el.box = a.rbox(), b.el.box.sw = b.el.box.w / b.el.transform().scaleX, b.el.box.sh = b.el.box.h / b.el.transform().scaleY, b.cur = a, $(b.cur.node).attr("id")) {
        case "svg-name":
            var d = b.data.name.text;
            break;
        case "svg-slogan":
            var d = b.data.slogan.text;
            break;
        case "svg-atext":
            var d = b.data.atext.text
        }
        if (d) {
            var e = /[\u4e00-\u9fa5]/;
            $(".js-svg-fonts .Moption").hide(),
            e.exec(d) ? $(".js-svg-fonts .Moption[data-chinese=1]").show() : $(".js-svg-fonts .Moption[data-chinese=0]").show()
        }
        c.svgColor(b.el.node),
        b.ghost.clear().translate(0, 0),
        b.mask = b.ghost.rect(b.el.box.w, b.el.box.h).id("svg-mask").translate(b.el.box.x - b.svg.box.x, b.el.box.y - b.svg.box.y).style("cursor", "move").front().attr({
            "fill-opacity": 0,
            stroke: "#4F80FF",
            "stroke-width": 1,
            "stroke-dasharray": "8,4"
        }),
        b.ghost.draggable(function(a, d) {
            b.ghost.translate(a, d),
            c.transform(b.mask);
            var e = {};
            return e.x = a,
            e.y = d,
            e
        }),
        b.ghost.off("dragend.namespace").on("dragend.namespace",
        function(a) {
            c.selected(b.el)
        }),
        c.resize(b.ghost),
        b.svg.on("click",
        function() {
            b.ghost.clear(),
            b.cur = ""
        })
    },
    c.transform = function(a) {
        var c = a.rbox(),
        d = c.w / b.el.box.sw,
        e = c.h / b.el.box.sh,
        f = c.x - b.svg.box.x - b.el.bbox().x * d,
        g = c.y - b.svg.box.y - b.el.bbox().y * e;
        b.el.transform(new SVG.Matrix(d, 0, 0, e, f, g))
    },
    c.resize = function(a) {
        b.mask.box = a.rbox(),
        $("#svg-resize-ctrl").remove(),
        b.ghost.group().id("svg-resize-ctrl").rect(8, 8).attr({
            fill: "#4F80FF"
        }).translate(b.mask.box.x - b.svg.box.x - 4, b.mask.box.y - b.svg.box.y - 4).id("svg-resize-nw").style("cursor", "nw-resize").addClass("svg-resize-ctrl-block").clone().id("svg-resize-n").style("cursor", "n-resize").move(b.mask.box.w / 2, 0).clone().id("svg-resize-ne").style("cursor", "ne-resize").move(b.mask.box.w, 0).clone().id("svg-resize-w").style("cursor", "w-resize").move(0, b.mask.box.h / 2).clone().id("svg-resize-sw").style("cursor", "sw-resize").move(0, b.mask.box.h).clone().id("svg-resize-s").style("cursor", "s-resize").move(b.mask.box.w / 2, b.mask.box.h).clone().id("svg-resize-se").style("cursor", "se-resize").move(b.mask.box.w, b.mask.box.h).clone().id("svg-resize-e").style("cursor", "e-resize").move(b.mask.box.w, b.mask.box.h / 2),
        b.svg.select(".svg-resize-ctrl-block").draggable(function(a, d, e) {
            var f = b.mask.box.h / b.mask.box.w,
            g = b.mask.box.w / b.mask.box.h;
            switch (_rx = -1 * (a - b.el.box.w), _ry = -1 * (d - b.el.box.h), this.node.id) {
            case "svg-resize-e":
                a > 0 && b.mask.width(a);
                break;
            case "svg-resize-s":
                d > 0 && b.mask.height(d);
                break;
            case "svg-resize-w":
                _rx > 0 && b.mask.width(_rx).move(a, 0);
                break;
            case "svg-resize-n":
                _ry > 0 && b.mask.height(_ry).move(0, d);
                break;
            case "svg-resize-se":
                d = a * f,
                a > 0 && b.mask.width(a),
                d > 0 && b.mask.height(d);
                break;
            case "svg-resize-ne":
                a = _ry * g,
                a > 0 && b.mask.width(a),
                _ry > 0 && b.mask.height(_ry).move(0, d);
                break;
            case "svg-resize-sw":
                d = _rx * f,
                _rx > 0 && b.mask.width(_rx).move(a, 0),
                d > 0 && b.mask.height(d);
                break;
            case "svg-resize-nw":
                _rx > 0 && (b.mask.width(_rx), b.mask.height(_rx * f), b.mask.move(a, a * f))
            }
            c.resize(b.mask),
            c.transform(b.mask);
            var h = {};
            return h.x = a,
            h.y = d,
            h
        }).off("dragend.namespace").on("dragend.namespace",
        function(a) {
            c.selected(b.el)
        })
    },
    c.init(),
    c
};