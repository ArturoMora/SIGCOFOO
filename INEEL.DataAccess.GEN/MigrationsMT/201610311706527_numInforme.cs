namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class numInforme : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "NumInforme", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            DropColumn("MT.InformeTecnicoFinal", "NumInforme");
        }
    }
}
