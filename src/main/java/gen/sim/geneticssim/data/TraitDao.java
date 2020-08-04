
package gen.sim.geneticssim.data;

import gen.sim.geneticssim.entities.Member;
import gen.sim.geneticssim.entities.Trait;
import java.util.List;

public interface TraitDao {
    public List<Trait> getAllTraits();

    public void retrieveMemberTraits(Member member);
}
