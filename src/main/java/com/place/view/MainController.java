package com.place.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

    @RequestMapping("/")
    public String user(Model model) {

        return "index";
    }

    @RequestMapping("/2")
    public String map(Model model) {
        return "map";
    }
}
