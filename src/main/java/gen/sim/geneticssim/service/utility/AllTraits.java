
package gen.sim.geneticssim.service.utility;

import gen.sim.geneticssim.entities.Trait;
import java.util.ArrayList;
import java.util.List;

public class AllTraits {
    private static List<Trait> allTraits;
    
    public static void setAllTraits(List<Trait> traits) {
        allTraits = traits;
    }
    
    public static List<Trait> getAllTraits() {
        return new ArrayList(allTraits);
    }
}
