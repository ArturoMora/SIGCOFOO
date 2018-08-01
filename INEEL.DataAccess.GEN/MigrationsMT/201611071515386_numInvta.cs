namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class numInvta : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "NumInventario", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            DropColumn("MT.InformeTecnicoFinal", "NumInventario");
        }
    }
}
