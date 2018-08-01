namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class impartidoCapacitacion : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_CapacitacionYcertificacion", "Impartio", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_CapacitacionYcertificacion", "Impartio");
        }
    }
}
