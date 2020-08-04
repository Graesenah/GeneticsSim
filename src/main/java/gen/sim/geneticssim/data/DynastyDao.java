
package gen.sim.geneticssim.data;

import gen.sim.geneticssim.entities.Dynasty;
import gen.sim.geneticssim.entities.Member;
import java.util.List;

public interface DynastyDao {
    public void addDynasty(Dynasty dynasty);

    public List<Dynasty> getAllDynasties();

    public List<Dynasty> getSearchDynasties(String search);

    public Dynasty getDynastyByName(String dynName);

    public Dynasty getPrimaryDynastyInfo(String name);

    public void headlineMemberDynastyInfo(Member member);
}
