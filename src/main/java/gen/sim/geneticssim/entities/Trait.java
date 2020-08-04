
package gen.sim.geneticssim.entities;

import java.util.ArrayList;
import java.util.List;

public class Trait {
    
    private String name;
    private List<String> values = new ArrayList();

    public Trait() {
        
    }

    public Trait(String name, List<String> values) {
        this.name = name;
        this.values = values;
    }

    public String getName() {
        return name;
    }

    public List<String> getValues() {
        return new ArrayList(values);
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setValues(List<String> values) {
        this.values = values;
    }
}
