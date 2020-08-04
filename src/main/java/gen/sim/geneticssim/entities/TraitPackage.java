
package gen.sim.geneticssim.entities;

import java.util.List;

public class TraitPackage {
    private Trait trait;
    private String value;
    private String[] valuePool;

    public TraitPackage() {
    }

    public TraitPackage(Trait trait) {
        this.trait = trait;
    }
    
    public Trait getTrait() {
        return trait;
    }

    public void setTrait(Trait trait) {
        this.trait = trait;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String[] getValuePool() {
        return valuePool;
    }

    public void setValuePool(String[] valuePool) {
        this.valuePool = valuePool;
    }
}
