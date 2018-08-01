namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class itfAnioElabora : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "AnioElaboracion", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("MT.InformeTecnicoFinal", "AnioElaboracion");
        }
    }
}
