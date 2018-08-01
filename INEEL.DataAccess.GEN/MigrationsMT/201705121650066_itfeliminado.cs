namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class itfeliminado : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "Eliminado", c => c.Boolean());
        }
        
        public override void Down()
        {
            DropColumn("MT.InformeTecnicoFinal", "Eliminado");
        }
    }
}
