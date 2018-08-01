namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class unidadPadre : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "ClaveUnidadPadre", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("MT.InformeTecnicoFinal", "ClaveUnidadPadre");
        }
    }
}
