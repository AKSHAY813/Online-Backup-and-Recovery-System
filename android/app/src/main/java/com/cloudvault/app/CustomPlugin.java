package com.cloudvault.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "CustomPlugin")
public class CustomPlugin extends Plugin {

    @PluginMethod
    public void helloWorld(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", "Hello from Native! You sent: " + value);
        call.resolve(ret);
    }
}
