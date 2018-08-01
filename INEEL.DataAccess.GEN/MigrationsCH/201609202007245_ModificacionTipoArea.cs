namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificacionTipoArea : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.cat_TipoArea", "Area", c => c.String(maxLength: 20));
            DropColumn("CH.cat_TipoArea", "Periodo");
        }
        
        public override void Down()
        {
            AddColumn("CH.cat_TipoArea", "Periodo", c => c.String(maxLength: 4));
            AlterColumn("CH.cat_TipoArea", "Area", c => c.String(maxLength: 4));
        }
    }
}
