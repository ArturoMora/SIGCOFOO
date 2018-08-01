namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioNivelDescripcion : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_DescripcionNiveles", "Comportamiento", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CH.cat_DescripcionNiveles", "Comportamiento");
        }
    }
}
